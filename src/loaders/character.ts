import Config from "../config";
import * as Character from "../descriptors/character";
import * as Filesystem from "../filesystem";

export async function get(name?: string): Promise<Character.Model | undefined> {
    if (!name) {
        return undefined;
    }

    const character_file_path = `${Config.authorland_root}/characters.json`;

    const file_contents = await Filesystem.read(character_file_path);
    if (!file_contents) {
        return undefined;
    }

    const stored_model = JSON.parse(file_contents) as {[name: string]: Character.Model};
    const case_normalized_model = Object.fromEntries(Object.entries(stored_model)
        .map(([name, model]) => [name.toLowerCase(), model])
    );

    let model = case_normalized_model[name.toLowerCase()];
    if (!model) {
        return undefined;
    }

    model = { ...model, name: name.toUpperCase() };

    return model;
}