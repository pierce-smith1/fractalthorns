import type {APIRoute} from "astro";
import * as Exp from "drizzle-orm/sqlite-core/expressions";
import sharp from "sharp";

import Db from "../../../data/db";
import * as Schema from "../../../data/schema/schema";

const RUNE_SIZE = 64;

export const GET: APIRoute = async context => {
    const {word} = context.params;

    if (!word) {
        return new Response(null, {status: 400});
    }

    const row = await Db.query.runeword.findFirst({
        with: {
            runeword_rune: {
                with: {
                    rune: true,
                }
            }
        },
        where: Exp.eq(Schema.runeword.name, word),
    });

    if (!row) {
        return new Response(null, {status: 404});
    }

    const mapping = row.runeword_rune.map(x => x.rune.name);
    const word_height = RUNE_SIZE * mapping.length;
    const word_width = RUNE_SIZE;

    const word_image = sharp({create: {
        width: word_width, 
        height: word_height, 
        channels: 4, 
        background: {r: 0, g: 0, b: 0, alpha: 0}}
    });

    const rune_data = await Db.select().from(Schema.file)
        .innerJoin(Schema.rune, Exp.eq(Schema.file.id, Schema.rune.file_id))
        .where(Exp.inArray(Schema.file.id, row.runeword_rune.map(x => x.rune.file_id)));

    word_image.composite(mapping.map((rune, i) => ({
        input: rune_data.find(row => row.rune.name === rune)!.file.data,
        top: RUNE_SIZE * i,
        left: 0,
    })));

    const image_data = await word_image.png().toBuffer();
    return new Response(image_data, {headers: {"Content-Type": "image/png"}});
};