import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";
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
        Db.deleteFrom("runeword").execute(),
        Db.deleteFrom("runeword_rune").execute(),
    ]);

    await Db
        .insertInto("runeword")
        .values(Object.keys(runewords_definition).map(name => ({name})))
        .execute();

    const runeword_relations = Object.entries(runewords_definition)
        .flatMap(([runeword, runes]) => runes.map((rune, i) => ({
            rune_name: rune,
            runeword_name: runeword,
            ordinal: i + 1,
        })));

    return Db
        .insertInto("runeword_rune")
        .values(runeword_relations)
        .execute()
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

    return Db
        .insertInto("rune")
        .values(new_row)
        .onConflict(oc => oc
            .column("name")
            .doUpdateSet(new_row)
         )
         .execute()
         .then(() => console.log(`Upserted rune ${name}`));
}

export async function delete_rune(name: string) {
    console.log(`Deleting rune ${name}...`);

    const row = await Db
        .selectFrom("rune")
        .selectAll()
        .where("name", "=", name)
        .executeTakeFirst();

    if (!row) {
        return;
    }

    const delete_files_promise = Db
        .deleteFrom("file")
        .where("id", "=", row.file_id)
        .execute();

    const delete_rune_rows_promise = Db
        .deleteFrom("rune")
        .where("name", "=", name)
        .execute();

    return Promise.all([
        delete_files_promise,
        delete_rune_rows_promise,
    ]).then(() => console.log(`Deleted rune ${name}`));
}
