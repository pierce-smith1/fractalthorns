import * as Fs from "fs/promises";

import { type APIRoute } from "astro";
import * as SketchLoader from "../../../loaders/sketch";

import Config from "../../../config";

export const GET: APIRoute = async context => {
    const name = context.params.name ?? "";
    const sketch = (await SketchLoader.load_all()).find(sketch => sketch.name === name);

    if (!sketch) {
        return new Response(null, {status: 404});
    }

    const png_path = `${Config.authorland_root}/sketches/${sketch.prefix}.${name}.png`;
    const png_data = await Fs.readFile(png_path);

    const response = new Response(png_data, {headers: {"Content-Type": "image/png"}});
    return response;
};

