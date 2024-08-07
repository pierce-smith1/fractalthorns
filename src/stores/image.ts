import sharp from "sharp";

import Config from "../config";

import * as Store from "./_store";
import * as Filesystem from "../filesystem";

export type DominantColors = {
    primary?: string,
    secondary?: string,
};

export type ImageInfo = {
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

export type Image = Omit<ImageInfo, "date"> & {
    name: string,
    date: Date,
    colors: DominantColors,
    description?: string,
    ordinal: number,
};

const info_file_name = "info.json";
const description_file_name = "descr.md";

export class ImageStore extends Store.Store<Image> {
    async load() {
        const images_root_path = `${Config.authorland_root}/images`;

        const image_entries = (await Filesystem.enumerate(images_root_path))
            .filter(entry => entry.type === "Directory");

        const images = await (async () => {
            const image_objects = await Promise.all(image_entries.map(async entry => (await this.load_one(entry.name))!));
            const by_date = image_objects.toSorted((a, b) => b.date.valueOf() - a.date.valueOf());
            const with_ordinals = by_date.map((image, i, images) => ({...image, ordinal: images.length - i}));
            return with_ordinals;
        })();

        return images;
    }

    async load_one(name: string): Promise<Omit<Image, "ordinal"> | undefined> {
        const info_path = `${Config.authorland_root}/images/${name}/${info_file_name}`;

        if (!await Filesystem.exists(info_path)) {
            return undefined;
        }

        const info_file_contents = await Filesystem.read(info_path);
        const info = JSON.parse(info_file_contents) as ImageInfo;

        const description_path = `${Config.authorland_root}/images/${name}/${description_file_name}`;
        const description = await Filesystem.exists(description_path)
            ? await Filesystem.read(description_path)
            : undefined;

        const private_image = {...info,
            name,
            description,
            date: new Date(info.date),
            colors: await this.load_dominant_colors(name),
        };

        return private_image;
    }

    async load_dominant_colors(name: string) {
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
            const png_path = `${Config.authorland_root}/images/${name}/img.png`;
            const png_data = await Filesystem.read_binary(png_path);

            const raw_data = await sharp(png_data, {sequentialRead: false})
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
};

const store = new ImageStore();
export default store;