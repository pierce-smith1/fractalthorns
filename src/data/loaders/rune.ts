import * as Exp from "drizzle-orm/sqlite-core/expressions";

import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";
import * as Schema from "../schema/schema";
import * as LoaderUtil from "./util";

type RunewordsDefinition = {
    [name: string]: Array<string>,
};

export async function regenerate_runewords() {
    console.log("Regenerating runewords...");

    const runewords_definition_path = `${Config.content_root}/runes/runewords.json`;
    const runewords_definition = JSON.parse(await Filesystem.read(runewords_definition_path)) as RunewordsDefinition;

    if (Object.keys(runewords_definition).length === 0) {
        console.log("No runes? :(");
        return;
    }

    await Promise.all([
        Db.delete(Schema.runeword),
        Db.delete(Schema.runeword_rune),
    ]);

    await Db.insert(Schema.runeword).values(Object.keys(runewords_definition).map(name => ({
        name,
    }))).returning();

    return Db.insert(Schema.runeword_rune).values(Object.entries(runewords_definition).flatMap(([runeword, runes]) => runes.map((rune, i) => ({
        rune_name: rune,
        runeword_name: runeword, 
        ordinal: i + 1,
    }))))
        .then(() => console.log("Regenerated runewords"));
}

export async function upsert_rune(name: string) {
    console.log(`Upserting rune ${name}...`);

    const rune_image_path = `${Config.content_root}/runes/images/${name}.png`;
    const rune_image_data = await Filesystem.read_binary(rune_image_path);

    const file_id = await LoaderUtil.ensure_file(rune_image_data);

    const new_row = {
        name,
        file_id,
    };

    return Db.insert(Schema.rune).values(new_row).onConflictDoUpdate({
        target: Schema.rune.name,
        set: new_row,
    }).then(() => console.log(`Upserted rune ${name}`));
}

export async function delete_rune(name: string) {
    console.log(`Deleting rune ${name}...`);

    const [row] = await Db.select().from(Schema.rune)
        .where(Exp.eq(Schema.rune.name, name));

    if (!row) {
        return;
    }

    return Promise.all([
        Db.delete(Schema.file).where(Exp.eq(Schema.file.id, row.file_id)),
        Db.delete(Schema.rune).where(Exp.eq(Schema.rune.name, name)),
    ]).then(() => console.log(`Deleted rune ${name}`));
}

/*
export async function populate() {
    const runewords_definition_path = `${Config.content_root}/runes/runewords.json`;
    const runewords_definition = JSON.parse(await Filesystem.read(runewords_definition_path)) as RunewordsDefinition;

    const rune_images_path = `${Config.content_root}/runes/images`;
    const rune_images = (await Filesystem.enumerate(rune_images_path))
        .filter(entry => entry.type === "File")
        .filter(entry => entry.name.endsWith(".png"));

    if (rune_images.length === 0) {
        return;
    }
        
    const file_rows = await Promise.all(rune_images.map(async entry => {
        const data = await Filesystem.read_binary(`${rune_images_path}/${entry.name}`);
        const name = entry.name.split(".")[0];
        const id = await LoaderUtil.ensure_file(data);

        return {id, name};
    }));

    const rune_rows = await Db.insert(Schema.rune).values(file_rows.map(row => ({
        file_id: row.id,
        name: row.name,
    }))).returning();

    const runeword_rows = await Db.insert(Schema.runeword).values(Object.keys(runewords_definition).map(name => ({
        name,
    }))).returning();

    return Db.insert(Schema.runeword_rune).values(Object.entries(runewords_definition).flatMap(([runeword, runes]) => runes.map(rune => ({
        rune_id: rune_rows.find(r => r.name === rune)!.id,
        runeword_id: runeword_rows.find(rw => rw.name === runeword)!.id,
    }))))
        .then(() => console.log(`Added runes`));
}
*/