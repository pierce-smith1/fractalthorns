import * as GenericUtil from "../../genericutil";
import * as RecordLoader from "../loaders/record";
import * as Directory from "./directory";

type LoadOperation =
    | {type: "regenerate-outline"}
    | {type: "regenerate-lines", name: string, chapter: string}
    | {type: "delete-lines", name: string}

export async function detect_and_resolve_changes() {
    const operations = await get_load_operations();
    console.log(`Detected ${operations.length} record changes`);

    return Promise.all(operations.map(operation => {
        if (operation.type === "regenerate-outline") {
            return RecordLoader.regenerate_story_outline();
        } else if (operation.type === "regenerate-lines") {
            return RecordLoader.regenerate_record_lines(operation.name, operation.chapter);
        } else if (operation.type === "delete-lines") {
            return RecordLoader.delete_record_lines(operation.name);
        }
    }));
}

async function get_load_operations(): Promise<Array<LoadOperation>> {
    const directory_changes = await Directory.get_changes();

    const operations = directory_changes.flatMap<LoadOperation>(change => {
        const record_change = extract_record_change(change);
        if (!record_change) {
            return [];
        }

        if (record_change.type === "outline") {
            return [{type: "regenerate-outline"}];
        } else if (change.type === "added" || change.type === "modified") {
            return [{type: "regenerate-lines", name: record_change.name, chapter: record_change.chapter}];
        } else {
            return [{type: "delete-lines", name: record_change.name}];
        }
    });

    return GenericUtil.unique_by_key(operations, operation => `${"name" in operation ? operation.name : ""}:${operation.type}`);
}

function extract_record_change(change: Directory.DirectoryChange)
    : null
    | {type: "outline"}
    | {type: "record", name: string, chapter: string}
{
    if (!change.path.startsWith("/records")) {
        return null;
    }

    if (change.path === "/records/story.json") {
        return {type: "outline"};
    }

    const [, , chapter_name, file_name] = change.path.split("/");
    const [, chapter] = chapter_name.split("-");
    const [name, ] = file_name.split(".");

    return {type: "record", name, chapter};
}
