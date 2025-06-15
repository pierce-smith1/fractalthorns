import * as Exp from "drizzle-orm/sqlite-core/expressions";

import * as Api from "../api/api";
import Db from "../data/db";
import * as Schema from "../data/schema/schema";

export async function get_one(name: string): Promise<Api.ImageObject | null> {
    const row = await Db.query.image.findFirst({
        where: Exp.eq(Schema.image.name, name),
    });

    if (!row) {
        return null;
    }

    return to_api_object(row);
}

export async function get_latest(): Promise<Api.ImageObject | null> {
    const row = await Db.query.image.findFirst({
        orderBy: Exp.desc(Schema.image.ordinal),
    });

    if (!row) {
        return null;
    }

    return to_api_object(row);
}

export async function get_all(): Promise<Array<Api.ImageObject>> {
    const rows = await Db.query.image.findMany({
        orderBy: Exp.desc(Schema.image.ordinal),
    });

    const images = rows.map(to_api_object);
    return images;
}

export function to_api_object(row: typeof Schema.image.$inferSelect): Api.ImageObject {
    const image = {
        name: row.name,
        title: row.title,
        date: row.date,
        ordinal: row.ordinal,
        image_url: `/serve/image/${row.name}`,
        thumb_url: `/serve/thumb/${row.name}`,
        canon: row.canon ?? undefined,
        has_description: !!row.description,
        characters: row.characters?.split(",") ?? [],
        speedpaint_video_url: row.speedpaint_url ?? undefined,
        primary_color: row.primary_color ?? undefined,
        secondary_color: row.secondary_color ?? undefined,
        is_latest: !!row.latest,
    };

    return image;
}
