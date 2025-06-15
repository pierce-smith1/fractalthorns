import * as GenericUtil from "../../genericutil";
import * as SketchLoader from "../loaders/sketch";
import * as Directory from "./directory";

export async function detect_and_resolve_changes() {
    const operations = await get_load_operations();
    console.log(`Detected ${operations.length} sketch changes`);

    if (operations.length === 0) {
        return;
    }

    const ordinals = await SketchLoader.compute_ordinals();

    return Promise.all(operations.map(operation => {
        if (operation.type === "upsert") {
            return SketchLoader.upsert_sketch(operation.name, operation.prefix, ordinals);
        } else if (operation.type === "upsert-with-info") {
            return SketchLoader.upsert_sketch(operation.name, operation.prefix, ordinals)
                .then(() => SketchLoader.update_sketch_info(operation.name));
        } else if (operation.type === "update-info") {
            return SketchLoader.update_sketch_info(operation.name);
        } else if (operation.type === "delete") {
            return SketchLoader.delete_sketch(operation.name);
        } else if (operation.type === "clear-info") {
            return SketchLoader.clear_sketch_info(operation.name);
        }
    }));
}

type LoadOperation =
    | {type: "upsert", name: string, prefix: string}
    | {type: "upsert-with-info", name: string, prefix: string}
    | {type: "update-info", name: string}
    | {type: "delete", name: string}
    | {type: "clear-info", name: string}

async function get_load_operations(): Promise<Array<LoadOperation>> {
    const directory_changes = await Directory.get_changes();

    let operations = directory_changes.flatMap<LoadOperation>(change => {
        const sketch_change = extract_sketch_change(change);
        if (!sketch_change) {
            return [];
        }

        if (change.type === "added" || change.type === "modified") {
            if (sketch_change.type === "png") {
                return [{type: "upsert", name: sketch_change.name, prefix: sketch_change.prefix}];
            } else {
                return [{type: "update-info", name: sketch_change.name}];
            }
        } else {
            if (sketch_change.type === "png") {
                return [{type: "delete", name: sketch_change.name}];
            } else {
                return [{type: "clear-info", name: sketch_change.name}];
            }
        }
    });

    operations = GenericUtil.unique_by_key(operations, operation => `${operation.name}:${operation.type}`);

    // Merge upserts and update-infos into single operations
    operations = operations.flatMap<LoadOperation>(operation => {
        if (operation.type === "upsert") {
            const matching_update_info_op = operations.find(x => x.type === "update-info" && x.name === operation.name);
            if (matching_update_info_op) {
                return [{type: "upsert-with-info", name: operation.name, prefix: operation.prefix}];
            }
        } else if (operation.type === "update-info" ) {
            const matching_upsert_op = operations.find(x => x.type === "upsert" && x.name === operation.name);
            if (matching_upsert_op) {
                return [];
            }
        }

        return [operation];
    });

    return operations;
}

function extract_sketch_change(change: Directory.DirectoryChange)
    : null
    | {type: "png", name: string, prefix: string}
    | {type: "info", name: string}
{
    if (!change.path.startsWith("/sketches")) {
        return null;
    }

    const [, , file_name] = change.path.split("/");

    if (file_name.endsWith(".json")) {
        const [name] = file_name.split(".");
        return {name, type: "info"};
    } else if (file_name.endsWith(".png")) {
        const [prefix, name] = file_name.split(".");
        return {name, prefix, type: "png"};
    } else {
        return null;
    }
}