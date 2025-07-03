import * as Kysely from "kysely"

import * as Api from "../api/api"
import Db from "../data/db"
import * as Schema from "../data/schema/schema"

type BaseImage = Api.ImageObject;

export async function get_one(name: string): Promise<BaseImage | null> {
    const row = await Db
        .selectFrom("image")
        .selectAll()
        .where("name", "=", name)
        .executeTakeFirst()

    if (!row) {
        return null;
    }

    return to_api_object(row);
}

export async function get_latest(): Promise<BaseImage | null> {
    const row = await Db
        .selectFrom("image")
        .selectAll()
        .orderBy("ordinal", "desc")
        .executeTakeFirst()

    if (!row) {
        return null;
    }

    return to_api_object(row);
}

export async function get_all(): Promise<Array<BaseImage>> {
    const rows = await Db
        .selectFrom("image")
        .selectAll()
        .execute();

    const images = rows.map(to_api_object);
    return images;
}

export function to_api_object(row: Kysely.Selectable<Schema.ImageTable>): BaseImage {
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
    };

    return image;
}
