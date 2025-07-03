import sharp from "sharp";

import Config from "../../config";
import * as Filesystem from "../../filesystem";
import * as ImageHelpers from "../../helpers/image";
import Db from "../db";
import * as LoaderUtil from "./util";

export const info_file_name = "info.json";
export const description_file_name = "descr.md";
export const image_file_name = "img.png";

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

type OrdinalInformation = {
    [name: string]: number,
};
export async function compute_ordinals(): Promise<OrdinalInformation> {
    const images_root_path = `${Config.content_root}/images`;

    const images = await Promise.all((await Filesystem.enumerate(images_root_path))
        .filter(entry => entry.type === "Directory")
        .map(async entry => {
            const info_path = `${images_root_path}/${entry.name}/${info_file_name}`;
            const info = JSON.parse(await Filesystem.read(info_path)) as ImageInfo;
            return {name: entry.name, date: new Date(info.date)};
        })
    );

    images.sort((a, b) => a.date.valueOf() - b.date.valueOf());

    const ordinals = Object.fromEntries(images.map((image, i) => {
        return [image.name, i + 1];
    }));
    return ordinals;
}

export async function upsert_image(name: string, ordinals: OrdinalInformation) {
    console.log(`Upserting image ${name}...`);

    const root_path = `${Config.content_root}/images/${name}`;

    const info_path = `${root_path}/${info_file_name}`;
    const info = JSON.parse(await Filesystem.read(info_path)) as ImageInfo;

    const description_path = `${root_path}/${description_file_name}`;
    const description = await Filesystem.exists(description_path)
        ? await Filesystem.read(description_path)
        : null;

    const data_path = `${root_path}/${image_file_name}`;
    const data = await Filesystem.read_binary(data_path);

    const dominant_colors = await load_dominant_colors(data);
    const thumbnail_data = await generate_image_thumbnail(data, info.center);

    const file_id = await LoaderUtil.ensure_file(data);
    const thumbnail_file_id = await LoaderUtil.ensure_file(thumbnail_data);

    const speedpaint_url = info.speedpaint_video_id 
        ? `https://www.youtube.com/watch?v=${info.speedpaint_video_id}`
        : null;

    const new_row = {
        name: name,
        title: info.title,
        date: ImageHelpers.american_to_iso_date(info.date),
        canon: info.canon,
        speedpaint_url,
        ordinal: ordinals[name],
        file_id,
        thumbnail_file_id,
        description: description,
        characters: info.characters?.join(","),
        primary_color: dominant_colors.primary,
        secondary_color: dominant_colors.secondary,
    };

    return Db
        .insertInto("image")
        .values(new_row)
        .onConflict(oc => oc
            .column("name")
            .doUpdateSet(new_row)
        )
        .execute()
        .then(() => console.log(`Inserted image ${name}`));
}

export async function delete_image(name: string) {
    console.log(`Deleting image ${name}...`);

    const image_row = await Db
        .selectFrom("image")
        .select([
            "id",
            "file_id",
            "thumbnail_file_id",
            "ordinal",
        ])
        .where("name", "=", name)
        .executeTakeFirst();

    if (!image_row) {
        return;
    }

    const delete_image_row_promise = Db
        .deleteFrom("image")
        .where("id", "=", image_row.id)
        .execute();

    const delete_files_promise = Db
        .deleteFrom("file")
        .where(eb => eb.or([
            eb("id", "=", image_row.file_id),
            eb("id", "=", image_row.thumbnail_file_id),
        ]))
        .execute();

    await Promise.all([
        delete_image_row_promise,
        delete_files_promise,
    ]);

    return Db
        .updateTable("image")
        .set({
            ordinal: eb => eb("ordinal", "-", 1),
        })
        .where("ordinal", ">", image_row.ordinal)
        .execute()
        .then(() => console.log(`Deleted image ${name}`));
}

export async function clear_image_description(name: string) {
    console.log(`Clearing image description ${name}...`);

    return Db
        .updateTable("image")
        .set({
            description: null,
        })
        .where("name", "=", name)
        .execute()
        .then(() => console.log(`Cleared description for ${name}`));
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
