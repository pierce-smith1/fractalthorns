import * as Exp from "drizzle-orm/sqlite-core/expressions";

import * as Api from "../api/api";
import Db from "../data/db";
import * as Schema from "../data/schema/schema";

export async function get_one(name: string): Promise<Api.SketchObject | null> {
    const row = await Db.query.sketch.findFirst({
        where: Exp.eq(Schema.sketch.name, name),
    });

    if (!row) {
        return null;
    }

    return to_api_object(row);
}

export async function get_latest(): Promise<Api.SketchObject | null> {
    const row = await Db.query.sketch.findFirst({
        orderBy: Exp.desc(Schema.sketch.ordinal),
    });

    if (!row) {
        return null;
    }

    return to_api_object(row);
}

export async function get_all(): Promise<Array<Api.SketchObject>> {
    const rows = await Db.query.sketch.findMany({
        orderBy: Exp.desc(Schema.sketch.ordinal),
    });

    const sketches = rows.map(to_api_object);
    return sketches;
}

export function to_api_object(row: typeof Schema.sketch.$inferSelect): Api.SketchObject {
    const sketch = {
        name: row.name,
        title: row.name,
        characters: row.characters?.split(",") ?? [],
        image_url: `/serve/sketch_image/${row.name}`,
        thumb_url: `/serve/sketch_thumb/${row.name}`,
        primary_color: row.primary_color ?? undefined,
        secondary_color: row.secondary_color ?? undefined,
        is_latest: !!row.latest,
    };

    return sketch;
}