import * as Kysely from "kysely"

import * as Api from "../api/api"
import Db from "../data/db"
import * as Schema from "../data/schema/schema"

export type BaseSketch = Api.SketchObject;

export async function get_one(name: string): Promise<BaseSketch | null> {
    const row = await Db
        .selectFrom("sketch")
        .selectAll()
        .where("sketch.name", "=", name)
        .executeTakeFirst();

    if (!row) {
        return null;
    }

    const sketch = to_object(row);
    return sketch;
}

export async function get_latest(): Promise<BaseSketch | null> {
    const row = await Db
        .selectFrom("sketch")
        .selectAll()
        .orderBy("sketch.ordinal", "desc")
        .limit(1)
        .executeTakeFirst();

    if (!row) {
        return null;
    }

    return to_object(row);
}

export async function get_all(): Promise<Array<Api.SketchObject>> {
    const rows = await Db
        .selectFrom("sketch")
        .selectAll()
        .orderBy("sketch.ordinal", "desc")
        .execute();

    const sketches = rows.map(to_object);
    return sketches;
}

export async function get_matching(term: string): Promise<Array<BaseSketch>> {
    const rows = await Db
        .selectFrom("sketch")
        .selectAll()
        .where(exp => exp.or([
            exp(exp.fn<number>("glob", [Kysely.sql.val(`*${term}*`), "sketch.name"]), "=", 1),
            // TODO This character search is not quite correct, because
            // something like "romal,e" can match when it really shouldn't.
            // I doubt anyone will notice, but this should get fixed.
            exp(exp.fn<number>("glob", [Kysely.sql.val(`*${term}*`), "sketch.characters"]), "=", 1),
        ]))
        .orderBy("sketch.ordinal", "desc")
        .execute();

    const images = rows.map(to_object)

    return images;
}

export async function get_data(name: string): Promise<Buffer | null> {
    const row = await Db
        .selectFrom("sketch")
        .innerJoin("file", "file.id", "sketch.file_id")
        .select("file.data as file_data")
        .where("sketch.name", "=", name)
        .executeTakeFirst();

    if (!row) {
        return null;
    }

    return row.file_data;
}

export async function get_thumbnail_data(name: string): Promise<Buffer | null> {
    const row = await Db
        .selectFrom("sketch")
        .innerJoin("file", "file.id", "sketch.thumbnail_file_id")
        .select("file.data as file_data")
        .where("sketch.name", "=", name)
        .executeTakeFirst();

    if (!row) {
        return null;
    }

    return row.file_data;
}

function to_object(row: Kysely.Selectable<Schema.SketchTable>): BaseSketch {
    const sketch = {
        name: row.name,
        title: row.name,
        characters: row.characters?.split(",") ?? [],
        image_url: `/serve/sketch_image/${row.name}`,
        thumb_url: `/serve/sketch_thumb/${row.name}`,
        primary_color: row.primary_color ?? undefined,
        secondary_color: row.secondary_color ?? undefined,
        remarks: row.remarks ?? undefined,
    };

    return sketch;
}
