import sharp from "sharp";

import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";
import * as Schema from "../schema/schema";
import * as LoaderUtil from "./util";

const info_file_name = "info.json";
const description_file_name = "descr.md";

type ImageInfo = {
    title: string,
    date: string,
    center: {
        x: number,
        y: number,
    },
    canon?: string,
    characters?: Array<string>,
    speedpaint_video_id?: string,
};

export async function populate() {
    const images_root_path = `${Config.content_root}/images`;

    const image_entries = (await Filesystem.enumerate(images_root_path))
        .filter(entry => entry.type === "Directory");

    const images = await Promise.all(image_entries.map(async ({name}) => {
        const info_path = `${Config.content_root}/images/${name}/${info_file_name}`;
        const info = JSON.parse(await Filesystem.read(info_path)) as ImageInfo;

        const description_path = `${Config.content_root}/images/${name}/${description_file_name}`;
        const description = await Filesystem.exists(description_path)
            ? await Filesystem.read(description_path)
            : null;

        const data_path = `${Config.content_root}/images/${name}/img.png`;
        const data = await Filesystem.read_binary(data_path);

        const dominant_colors = await load_dominant_colors(data);
        const thumbnail_data = await generate_image_thumbnail(data, info.center);

        const date = new Date(info.date);

        return {
            name, info, description, data, dominant_colors, thumbnail_data, date,
        };
    }));

    images.sort((a, b) => b.date.valueOf() - a.date.valueOf());

    return Promise.all(images.map(async image => {
        const file_id = await LoaderUtil.ensure_file(image.data);
        const thumbnail_file_id = await LoaderUtil.ensure_file(image.thumbnail_data);

        const ordinal = images.length - images.findIndex(img => img.name === image.name);
        const speedpaint_url = image.info.speedpaint_video_id 
            ? `https://www.youtube.com/watch?v=${image.info.speedpaint_video_id}`
            : null;

        return Db.insert(Schema.image).values({
            name: image.name,
            title: image.info.title,
            date: new Date(image.info.date).toISOString(),
            canon: image.info.canon,
            speedpaint_url,
            ordinal,
            file_id,
            thumbnail_file_id,
            description: image.description,
            characters: image.info.characters?.join(","),
            primary_color: image.dominant_colors.primary,
            secondary_color: image.dominant_colors.secondary,
        }).returning()
            .then(() => console.log(`Added image ${image.name}`));
    }));
}

export async function load_dominant_colors(data: Buffer) {
    type Color = {r: number, g: number, b: number};
    type Brightness = "d" | "m" | "l";
    type ColorBucket = `${Brightness}${Brightness}${Brightness}`;
    type ColorBuckets = {[bucket in ColorBucket]?: Array<Color>};

    function color_to_bucket(color: Color): ColorBucket {
        function channel_brightness(value: number): Brightness {
            if (value < 60) return "d";
            if (value < 200) return "m";
            return "l";
        }
        return `${channel_brightness(color.r)}${channel_brightness(color.g)}${channel_brightness(color.b)}`;
    }

    function bucket_colors(colors: Array<Color>): ColorBuckets {
        const buckets: ColorBuckets = {};

        for (const color of colors) {
            const bucket_name = color_to_bucket(color);
            const bucket = buckets[bucket_name] ??= [];
            bucket.push(color);
        }

        return buckets;
    }

    function trim_grayscale_buckets(buckets: ColorBuckets) {
        delete buckets["ddd"];
        delete buckets["mmm"];
        delete buckets["lll"];
    }

    function median_of_bucket(bucket: Array<Color>): Color | undefined {
        if (bucket.length === 0) {
            return undefined;
        }

        const r = Math.floor((bucket[0].r + bucket[bucket.length - 1].r) / 2);
        const g = Math.floor((bucket[0].g + bucket[bucket.length - 1].g) / 2);
        const b = Math.floor((bucket[0].b + bucket[bucket.length - 1].b) / 2);
        return {r, g, b};
    }

    function get_largest_buckets(buckets: ColorBuckets): [Array<Color> | undefined, Array<Color> | undefined] {
        const buckets_by_descending_size = Object.values(buckets)
            .toSorted((a, b) => b.length - a.length);
        return [buckets_by_descending_size[0], buckets_by_descending_size[1]];
    }

    function color_to_string(color: Color) {
        const str = `#${color.r.toString(16).padStart(2, '0')}${color.g.toString(16).padStart(2, '0')}${color.b.toString(16).padStart(2, '0')}`;
        return str;
    }

    async function get_png_data(): Promise<Buffer> {
        const raw_data = await sharp(data, {sequentialRead: false})
            .resize(128, 128, {fit: "fill"})
            .ensureAlpha() // TODO: This algo needs to properly ignore fully transparent pixels
                        // it's not the hugest deal though because I haven't made any transparent art yet
            .raw()
            .toBuffer();

        return raw_data;
    }

    function raw_data_to_colors(raw_data: Buffer): Array<Color> {
        let offset = 0;
        const colors: Array<Color> = [];

        while (offset < raw_data.length) {
            const r = raw_data.readUint8(offset);
            const g = raw_data.readUint8(offset + 1);
            const b = raw_data.readUint8(offset + 2);

            colors.push({r, g, b});

            offset += 4;
        }

        return colors;
    }

    const raw_data = await get_png_data();
    const colors = raw_data_to_colors(raw_data);
    const buckets = bucket_colors(colors);

    trim_grayscale_buckets(buckets);

    const dominant_buckets = get_largest_buckets(buckets);
    const dominant_colors = dominant_buckets.map(bucket => bucket ? median_of_bucket(bucket) : undefined);
    const dominant_strings = dominant_colors.map(color => color ? color_to_string(color) : undefined);

    const [primary_string, secondary_string] = dominant_strings;
    return {
        primary: primary_string, 
        secondary: secondary_string,
    };
}

async function generate_image_thumbnail(data: Buffer, center: {x: number, y: number}) {
    const width = 300;
    const height = 60;

    const extended_thumb_data = await sharp(data, {sequentialRead: false})
        .extend({
            top: height,
            bottom: height,
            left: width,
            right: width,
            extendWith: "mirror",
        })
        .toBuffer();

    const thumb_data = await sharp(extended_thumb_data)
        .extract({ 
            left: (center.x + width) - (width / 2),
            top: (center.y + height) - (height / 2),
            width,
            height,
        })
        .toBuffer();

    return thumb_data;
}