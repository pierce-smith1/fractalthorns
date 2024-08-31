import * as Fs from "fs/promises";

import { type APIRoute } from "astro";
import sharp from "sharp";

import Sketches from "../../../stores/sketch";
import Config from "../../../config";

const image_thumbnail_width = 100;
const image_thumbnail_height = 100;

const thumbnail_cache: {[key: string]: Buffer} = {};

export const GET: APIRoute = async context => {
    const name = context.params.name ?? "";

    if (name in thumbnail_cache) {
        return new Response(thumbnail_cache[name], {headers: {"Content-Type": "image/png"}});
    }

    const sketch = Sketches.get().find(sketch => sketch.name === name);

    if (!sketch) {
        return new Response(null, {status: 404});
    }

    const png_path = `${Config.authorland_root}/sketches/${name}.png`;
    const png_data = await Fs.readFile(png_path);

    const thumb_data = await sharp(png_data)
        .resize(
            image_thumbnail_width,
            image_thumbnail_height,
            {fit: "cover"},
        )
        .toBuffer();

    const response = new Response(thumb_data, {headers: {"Content-Type": "image/png"}});
    
    thumbnail_cache[name] = thumb_data;

    return response;
};