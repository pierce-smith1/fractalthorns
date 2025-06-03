import * as Exp from "drizzle-orm/sqlite-core/expressions";

import Db from "../../../data/db";
import * as Schema from "../../../data/schema/schema";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"image_description">(async (request, override) => {
    const {name} = request;

    const row = await Db.query.image.findFirst({
        where: Exp.eq(Schema.image.name, name),
        columns: {
            description: true,
        },
    });

    if (!row) {
        return override(new Response(null, {status: 404}));
    }

    return {
        description: row.description ?? undefined
    };
});