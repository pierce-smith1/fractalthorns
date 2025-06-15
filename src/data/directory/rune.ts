import * as GenericUtil from "../../genericutil";
import * as RuneLoader from "../loaders/rune";
import * as Directory from "./directory";

export async function detect_and_resolve_changes() {
    const operations = await get_load_operations();
    console.log(`Detected ${operations.length} rune changes`);

    return Promise.all(operations.map(operation => {
        if (operation.type === "regenerate-runewords") {
            return RuneLoader.regenerate_runewords();
        } else if (operation.type === "upsert") {
            return RuneLoader.upsert_rune(operation.name);
        } else if (operation.type === "delete") {
            return RuneLoader.delete_rune(operation.name);
        }
    }));
}

type LoadOperation = 
    | {type: "regenerate-runewords"}
    | {type: "upsert", name: string}
    | {type: "delete", name: string}

async function get_load_operations(): Promise<Array<LoadOperation>> {
    const directory_changes = await Directory.get_changes();

    const operations = directory_changes.flatMap<LoadOperation>(change => {
        const rune_change = extract_rune_change(change);
        if (!rune_change) {
            return [];
        }

        if (rune_change.type === "regenerate-runewords") {
            return [{type: "regenerate-runewords"}];
        } else if (change.type === "added" || change.type === "modified") {
            return [{type: "upsert", name: rune_change.name}];
        } else {
            return [{type: "delete", name: rune_change.name}];
        }
    });

    return GenericUtil.unique_by_key(operations, operation => `${"name" in operation ? operation.name : ""}:${operation.type}`);
}

function extract_rune_change(change: Directory.DirectoryChange)
    : null
    | {type: "regenerate-runewords"}
    | {type: "rune", name: string}
{
    if (!change.path.startsWith("/runes")) {
        return null;
    }

    if (change.path === "/runes/runewords.json") {
        return {type: "regenerate-runewords"};
    }

    const [, , , file_name] = change.path.split("/");
    const [rune, ] = file_name.split(".");

    return {type: "rune", name: rune};
}