import * as Drizzle from "drizzle-orm";
import * as Exp from "drizzle-orm/sqlite-core/expressions";
import sharp from "sharp";

import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";
import * as Schema from "../schema/schema";
import * as ImageLoader from "./image";
import * as LoaderUtil from "./util";

type SketchInfo = {
    characters?: Array<string>,
};

type OrdinalInformation = {
    [name: string]: number,
};
export async function compute_ordinals(): Promise<OrdinalInformation> {
    const sketches_root_path = `${Config.content_root}/sketches`;

    const sketches = await Promise.all((await Filesystem.enumerate(sketches_root_path))
        .filter(entry => entry.type === "File")
        .filter(entry => entry.name.endsWith(".png"))
        .map(async entry => {
            const [prefix, name] = entry.name.split(".")
            return {name, prefix};
        })
    );

    sketches.sort((a, b) => parseInt(a.prefix, 10) - parseInt(b.prefix, 10));

    const ordinals = Object.fromEntries(sketches.map((sketch, i) => {
        return [sketch.name, i + 1];
    }));
    return ordinals;
}

export async function upsert_sketch(name: string, prefix: string, ordinals: OrdinalInformation) {
    console.log(`Upserting sketch ${name}...`);

    const sketches_root_path = `${Config.content_root}/sketches`;

    const data_path = `${sketches_root_path}/${prefix}.${name}.png`;
    const data = await Filesystem.read_binary(data_path);

    const dominant_colors = await ImageLoader.load_dominant_colors(data);
    const thumbnail_data = await generate_sketch_thumbnail(data);

    const file_id = await LoaderUtil.ensure_file(data);
    const thumbnail_file_id = await LoaderUtil.ensure_file(thumbnail_data);

    const new_row = {
        name: name,
        ordinal: ordinals[name],
        file_id,
        thumbnail_file_id,
        primary_color: dominant_colors.primary,
        secondary_color: dominant_colors.secondary,
    };

    return Db.insert(Schema.sketch).values(new_row).onConflictDoUpdate({
        target: Schema.sketch.name,
        set: new_row,
    }).then(() => console.log(`Added sketch ${name}`));
}

export async function delete_sketch(name: string) {
    console.log(`Deleting sketch ${name}...`);

    const [row] = await Db.select({
        file_id: Schema.sketch.file_id,
        thumbnail_id: Schema.sketch.thumbnail_file_id,
        ordinal: Schema.sketch.ordinal
    }).from(Schema.sketch)
        .where(Exp.eq(Schema.sketch.name, name));

    if (!row) {
        return;
    }

    await Promise.all([
        Db.delete(Schema.sketch).where(Exp.eq(Schema.sketch.name, name)),
        Db.delete(Schema.file).where(Exp.inArray(Schema.file.id, [row.file_id, row.thumbnail_id])),
    ]);

    return Db.update(Schema.sketch).set({
        ordinal: Drizzle.sql`${Schema.sketch.ordinal} - 1`,
    }).where(Exp.gt(Schema.sketch.ordinal, row.ordinal))
        .then(() => console.log(`Deleted sketch ${name}`));
}

export async function update_sketch_info(name: string) {
    console.log(`Updating sketch info for ${name}...`);

    const sketches_root_path = `${Config.content_root}/sketches`;

    const info_path = `${sketches_root_path}/${name}.json`;
    const info = await Filesystem.exists(info_path)
        ? JSON.parse(await Filesystem.read(info_path)) as SketchInfo
        : null;

    return Db.update(Schema.sketch).set({
        characters: info?.characters?.join(","),
    }).where(Exp.eq(Schema.sketch.name, name))
        .then(() => console.log(`Updated sketch info for ${name}`));
}

export async function clear_sketch_info(name: string) {
    console.log(`Clearing sketch info for ${name}`);

    return Db.update(Schema.sketch).set({
        characters: null,
    }).where(Exp.eq(Schema.sketch.name, name))
        .then(() => console.log(`Cleared sketch info for ${name}`));
}

async function generate_sketch_thumbnail(data: Buffer) {
    const width = 72;
    const height = 72;

    const thumb_data = await sharp(data)
        .resize(width, height, {fit: "cover"})
        .toBuffer();

    return thumb_data;
}