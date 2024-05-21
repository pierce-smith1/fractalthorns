import * as Fs from "fs/promises";

import { type APIRoute } from "astro";
import sharp from "sharp";

import * as Image from "../../../loaders/image";
import Config from "../../../config";

const image_thumbnail_width = 300;
const image_thumbnail_height = 50;

export const GET: APIRoute = async context => {
    const name = context.params.name ?? "";
    const image_model = await Image.get(name);

    if (!image_model) {
        return new Response(null, {status: 404});
    }

    const png_path = `${Config.authorland_root}/images/${name}/img.png`;
    const png_data = await Fs.readFile(png_path);

    const thumb_center = image_model.center;

    const extended_thumb_data = await sharp(png_data, {sequentialRead: false})
        .extend({
            top: image_thumbnail_height,
            bottom: image_thumbnail_height,
            left: image_thumbnail_width,
            right: image_thumbnail_width,
            extendWith: "mirror",
        })
        .toBuffer();

    const thumb_data = await sharp(extended_thumb_data)
        .extract({ 
            left: (thumb_center.x + image_thumbnail_width) - (image_thumbnail_width / 2),
            top: (thumb_center.y + image_thumbnail_height) - (image_thumbnail_height / 2),
            width: image_thumbnail_width,
            height: image_thumbnail_height,
        })
        .toBuffer();

    const response = new Response(thumb_data, {headers: {"Content-Type": "image/png"}});
    return response;
};