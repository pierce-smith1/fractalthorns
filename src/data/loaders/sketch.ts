import sharp from 'sharp';

import Config from '../../config';
import * as Filesystem from '../../filesystem';
import Db from '../db';
import * as Schema from '../schema/schema';
import * as ImageLoader from './image';
import * as LoaderUtil from './util';

type SketchInfo = {
    characters?: Array<string>
};

export async function populate() {
    const sketch_root_path = `${Config.content_root}/sketches`;

    const sketch_entries = (await Filesystem.enumerate(sketch_root_path))
        .filter(item => item.type === "File")
        .filter(item => item.name.endsWith(".png"));

    const sketches = await Promise.all(sketch_entries.map(async entry => {
        const [prefix, name] = entry.name.split(".");

        const info_path = `${Config.content_root}/sketches/${name}.json`;
        const info = await Filesystem.exists(info_path)
            ? JSON.parse(await Filesystem.read(info_path)) as SketchInfo
            : null;

        const data_path = `${Config.content_root}/sketches/${entry.name}`;
        const data = await Filesystem.read_binary(data_path);

        const dominant_colors = await ImageLoader.load_dominant_colors(data);
        const thumbnail_data = await generate_sketch_thumbnail(data);

        return {
            prefix, name, info, data, dominant_colors, thumbnail_data
        };
    }));

    sketches.sort((a, b) => parseInt(b.prefix, 10) - parseInt(a.prefix, 10));

    return Promise.all(sketches.map(async sketch => {
        const file_id = await LoaderUtil.ensure_file(sketch.data);
        const thumbnail_file_id = await LoaderUtil.ensure_file(sketch.thumbnail_data);

        const ordinal = sketches.length - sketches.findIndex(sk => sk.name === sketch.name);

        return Db.insert(Schema.sketch).values({
            name: sketch.name,
            ordinal,
            file_id,
            thumbnail_file_id,
            characters: sketch.info?.characters?.join(","),
            primary_color: sketch.dominant_colors.primary,
            secondary_color: sketch.dominant_colors.secondary,
        }).then(() => console.log(`Added sketch ${sketch.name}`));
    }));
}

async function generate_sketch_thumbnail(data: Buffer) {
    const width = 72;
    const height = 72;

    const thumb_data = await sharp(data)
        .resize(width, height, {fit: "cover"})
        .toBuffer();

    return thumb_data;
}