import type {APIRoute} from 'astro';
import * as Exp from 'drizzle-orm/sqlite-core/expressions';

import Db from '../../../data/db';
import * as Schema from '../../../data/schema/schema';

export const GET: APIRoute = async context => {
    const {name} = context.params;

    if (!name) {
        return new Response(null, {status: 400});
    }

    // This could have used relations to write a drizzle query instead of a SQL one,
    // but drizzle is fucking stupid and doesn't support handling blobs
    // https://github.com/drizzle-team/drizzle-orm/issues/3497
    const [{data}] = await Db.select({
        data: Schema.file.data,
    }).from(Schema.image)
        .innerJoin(Schema.file, Exp.eq(Schema.image.file_id, Schema.file.id))
        .where(Exp.eq(Schema.image.name, name));

    if (!data) {
        return new Response(null, {status: 404});
    }

    const response = new Response(data, {headers: {"Content-Type": "image/png"}});
    return response;
};