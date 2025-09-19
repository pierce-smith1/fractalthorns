import sharp from "sharp";

import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";
import * as ImageLoader from "./image";
import * as LoaderUtil from "./util";

type SketchInfo = {
    characters?: Array<string>,
    remarks?: string,
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

    return Db
        .insertInto("sketch")
        .values(new_row)
        .onConflict(oc => oc
            .column("name")
            .doUpdateSet(new_row)
         )
        .execute()
        .then(() => console.log(`Added sketch ${name}`));
}

export async function delete_sketch(name: string) {
    console.log(`Deleting sketch ${name}...`);

    const sketch_row = await Db
        .selectFrom("sketch")
        .select([
            "id",
            "file_id",
            "thumbnail_file_id",
            "ordinal",
        ])
        .where("name", "=", name)
        .executeTakeFirst();

    if (!sketch_row) {
        return;
    }

    const delete_sketch_row_promise = Db
        .deleteFrom("sketch")
        .where("id", "=", sketch_row.id)
        .execute();

    const delete_files_promise = Db
        .deleteFrom("sketch")
        .where(eb => eb.or([
            eb("id", "=", sketch_row.file_id),
            eb("id", "=", sketch_row.thumbnail_file_id),
        ]))
        .execute();

    await Promise.all([
        delete_sketch_row_promise,
        delete_files_promise,
    ]);

    return Db
        .updateTable("image")
        .set({
            ordinal: eb => eb("ordinal", "-", 1),
        })
        .where("ordinal", ">", sketch_row.ordinal)
        .execute()
        .then(() => console.log(`Deleted sketch ${name}`));
}

export async function update_sketch_info(name: string) {
    console.log(`Updating sketch info for ${name}...`);

    const sketches_root_path = `${Config.content_root}/sketches`;

    const info_path = `${sketches_root_path}/${name}.json`;
    const info = await Filesystem.exists(info_path)
        ? JSON.parse(await Filesystem.read(info_path)) as SketchInfo
        : null;

    return Db
        .updateTable("sketch")
        .set({
            characters: info?.characters?.join(","),
            remarks: info?.remarks,
        })
        .where("name", "=", name)
        .execute()
        .then(() => console.log(`Updated sketch info for ${name}`));
}

export async function clear_sketch_info(name: string) {
    console.log(`Clearing sketch info for ${name}`);

    return Db
        .updateTable("sketch")
        .set({
            characters: null,
        })
        .where("name", "=", name)
        .execute()
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
