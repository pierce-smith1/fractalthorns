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

    const image = to_api_object(row);
    return image;
}

export async function get_latest(): Promise<BaseImage | null> {
    const row = await Db
        .selectFrom("image")
        .selectAll()
        .orderBy("ordinal", "desc")
        .limit(1)
        .executeTakeFirst()

    if (!row) {
        return null;
    }

    const image = to_api_object(row);
    return image;
}

export async function get_all(): Promise<Array<BaseImage>> {
    const rows = await Db
        .selectFrom("image")
        .selectAll()
        .orderBy("image.ordinal", "desc")
        .execute();

    const images = rows.map(to_api_object);
    return images;
}

export async function get_matching(term: string): Promise<Array<BaseImage>> {
    const rows = await Db
        .selectFrom("image")
        .selectAll()
        .where(exp => exp.or([
            exp(exp.fn<number>("glob", [Kysely.sql<string>`*${term}*`, "image.name"]), "=", 1),
            exp(exp.fn<number>("glob", [Kysely.sql<string>`*${term}*`, "image.title"]), "=", 1),
        ]))
        .execute();

    const images = rows.map(to_api_object)
        // Searching for characters is a little impractical in SQL unforunately
        .filter(image => image.characters.find(x => x.includes(term)))

    return images;
}

export async function get_data(name: string): Promise<Buffer | null> {
    const row = await Db
        .selectFrom("image")
        .innerJoin("file", "file.id", "image.file_id")
        .select("file.data as file_data")
        .where("image.name", "=", name)
        .executeTakeFirst();

    if (!row) {
        return null;
    }

    return row.file_data;
}

export async function get_thumbnail_data(name: string): Promise<Buffer | null> {
    const row = await Db
        .selectFrom("image")
        .innerJoin("file", "file.id", "image.thumbnail_file_id")
        .select("file.data as file_data")
        .where("image.name", "=", name)
        .executeTakeFirst();

    if (!row) {
        return null;
    }

    return row.file_data;
}

export async function get_description(name: string): Promise<string | null> {
    const row = await Db
        .selectFrom("image")
        .select("image.description")
        .where("image.name", "=", name)
        .executeTakeFirst();

    if (!row) {
        return null;
    }

    return row.description;
}

function to_api_object(row: Kysely.Selectable<Schema.ImageTable>): BaseImage {
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
