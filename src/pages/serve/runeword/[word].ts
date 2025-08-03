import type {APIRoute} from "astro"
import sharp from "sharp"

import * as RuneQueries from "../../../queries/rune"

const RUNE_SIZE = 64;

export const GET: APIRoute = async context => {
    const {word} = context.params;
    if (!word) {
        return new Response(null, {status: 400});
    }

    const runes = await RuneQueries.get_runes_for_runeword(word);
    if (runes.length === 0) {
        return new Response(null, {status: 404});
    }

    const word_height = RUNE_SIZE * runes.length;
    const word_width = RUNE_SIZE;

    const word_image = sharp({create: {
        width: word_width, 
        height: word_height, 
        channels: 4, 
        background: {r: 0, g: 0, b: 0, alpha: 0}}
    });

    word_image.composite(runes.map((rune, i) => ({
        input: rune.data,
        top: RUNE_SIZE * i,
        left: 0,
    })));

    const image_data = await word_image.png().toBuffer();
    return new Response(new Uint8Array(image_data), {headers: {"Content-Type": "image/png"}});
};
