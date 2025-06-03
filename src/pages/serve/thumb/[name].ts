import type {APIRoute} from "astro";
import * as Exp from "drizzle-orm/sqlite-core/expressions";

import Db from "../../../data/db";
import * as Schema from "../../../data/schema/schema";

export const GET: APIRoute = async context => {
    const {name} = context.params;

    if (!name) {
        return new Response(null, {status: 400});
    }

    const [{data}] = await Db.select({
        data: Schema.file.data,
    }).from(Schema.image)
        .innerJoin(Schema.file, Exp.eq(Schema.image.thumbnail_file_id, Schema.file.id))
        .where(Exp.eq(Schema.image.name, name));

    if (!data) {
        return new Response(null, {status: 404});
    }

    const response = new Response(data, {headers: {"Content-Type": "image/png"}});
    return response;
};