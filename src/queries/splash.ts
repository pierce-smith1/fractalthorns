import * as Kysely from "kysely"

import * as Api from "../api/api"
import Db from "../data/db"
import * as Schema from "../data/schema/schema"
import Config from "../config"

type BaseSplash = Api.SplashObject;

export async function get_current(): Promise<BaseSplash | null> {
    await ensure_cursor_advanced();

    const cursor = await Db
        .selectFrom("splash_cursor")
        .selectAll()
        .executeTakeFirstOrThrow();

    const splash = await Db
        .selectFrom("splash")
        .selectAll()
        .where("splash.ordinal", "=", cursor.position)
        .executeTakeFirst();

    if (!splash) {
        return null;
    }

    return to_api_object(splash);
}

export async function get_paged(page: number): Promise<Array<BaseSplash>> {
    await ensure_cursor_advanced();

    const page_size = 20;

    const cursor = await Db
        .selectFrom("splash_cursor")
        .selectAll()
        .executeTakeFirstOrThrow();

    const rows = await Db
        .selectFrom("splash")
        .selectAll()
        .where("splash.ordinal", "<=", cursor.position)
        .orderBy("splash.ordinal", "desc")
        .offset(page_size * (page - 1))
        .limit(page_size)
        .execute();

    return rows.map(to_api_object);
}

export async function queue_discord_splash(request: Api.DiscordSplashUploadRequest): Promise<
    | {status: "ok"}
    | {status: "rate-limited", retry_after_ms: number}
> {
    await ensure_cursor_advanced();

    const max_splash_rate_ms = parseInt(Config.splash_rate_limit_ms, 10);

    const too_recent_splash = await Db
        .selectFrom("splash")
        .innerJoin("splash_discord_detail", "splash_discord_detail.splash_id", "splash.id")
        .select(eb =>
            eb(eb.fn<number>("unixepoch", [eb.val("now")]), "-", eb.fn<number>("unixepoch", ["created_at"])).as("s_since_submit"),
        )
        .where(eb => eb.and([
            eb("splash_discord_detail.user_id", "=", request.submitter_user_id),
            eb(Kysely.sql`s_since_submit`, "<", max_splash_rate_ms / 1000),
        ]))
        .orderBy("splash.created_at", "desc")
        .executeTakeFirst();

    if (too_recent_splash) {
        return {status: "rate-limited", retry_after_ms: max_splash_rate_ms - (too_recent_splash.s_since_submit * 1000)};
    }

    Db.transaction().execute(async ctx => {
        const most_recent_splash = await ctx
            .selectFrom("splash")
            .select("ordinal")
            .orderBy("ordinal", "desc")
            .executeTakeFirst();

        const new_splash = await ctx
            .insertInto("splash")
            .values({
                text: request.text,
                created_at: new Date().toISOString(),
                ordinal: (most_recent_splash?.ordinal ?? 0) + 1,
                source: "discord",
            })
            .returning("id")
            .executeTakeFirstOrThrow();

        await ctx
            .insertInto("splash_discord_detail")
            .values({
                splash_id: new_splash.id,
                display_name: request.submitter_display_name,
                user_id: request.submitter_user_id,
            })
            .execute();
    });

    return {status: "ok"};
}

export async function ensure_cursor_advanced(): Promise<void> {
    const advance_interval_ms = parseInt(Config.splash_advance_interval_ms);
    const now = new Date();

    const cursor = await Db
        .selectFrom("splash_cursor")
        .selectAll()
        .executeTakeFirst();

    if (!cursor) {
        await Db
            .insertInto("splash_cursor")
            .values({
                position: 1,
                last_updated: now.toISOString(),
            })
            .execute();

        return;
    }

    const {max_splash_ordinal} = await Db
        .selectFrom("splash")
        .select(eb => eb.fn<number>("max", ["ordinal"]).as("max_splash_ordinal"))
        .executeTakeFirstOrThrow();

    const cursor_midnights = Math.floor(new Date(cursor.last_updated).valueOf() / (advance_interval_ms));
    const now_midnights = Math.floor(now.valueOf() / (advance_interval_ms));

    const advances_needed = now_midnights - cursor_midnights;

    if (advances_needed > 0) {
        await Db
            .updateTable("splash_cursor")
            .set({
                position: Math.min(cursor.position + advances_needed, max_splash_ordinal + 1),
                last_updated: now.toISOString(),
            })
            .execute();
    }
}

function to_api_object(row: Kysely.Selectable<Schema.SplashTable>): BaseSplash {
    const object = {
        text: row.text,
        ordinal: row.ordinal,
    };
    return object;
}
