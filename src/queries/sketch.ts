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
        .execute();

    const sketches = rows.map(to_object);
    return sketches;
}

export async function get_matching(term: string): Promise<Array<BaseSketch>> {
    const rows = await Db
        .selectFrom("sketch")
        .selectAll()
        .where(exp => exp.or([
            exp(exp.fn<number>("glob", [Kysely.sql<string>`*${term}*`, "sketch.name"]), "=", 1),
        ]))
        .execute();

    const images = rows.map(to_object)
        // Searching for characters is a little impractical in SQL unforunately
        .filter(sketch => sketch.characters.find(x => x.includes(term)))

    return images;
}

export function to_object(row: Kysely.Selectable<Schema.SketchTable>): BaseSketch {
    const sketch = {
        name: row.name,
        title: row.name,
        characters: row.characters?.split(",") ?? [],
        image_url: `/serve/sketch_image/${row.name}`,
        thumb_url: `/serve/sketch_thumb/${row.name}`,
        primary_color: row.primary_color ?? undefined,
        secondary_color: row.secondary_color ?? undefined,
    };

    return sketch;
}
