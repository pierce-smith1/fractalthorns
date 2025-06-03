import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";
import * as Schema from "../schema/schema";
import * as LoaderUtil from "./util";

type RunewordsDefinition = {
    [name: string]: Array<string>,
};

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