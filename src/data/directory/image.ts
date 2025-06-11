import * as GenericUtil from "../../genericutil";
import * as ImageLoader from "../loaders/image";
import * as Directory from "./directory";

export async function detect_and_resolve_changes() {
    const operations = await get_load_operations();
    console.log(`Detected ${operations.length} image changes`);

    if (operations.length === 0) {
        return;
    }

    const ordinals = await ImageLoader.compute_ordinals();

    return Promise.all(operations.map(operation => {
        if (operation.type === "upsert") {
            return ImageLoader.upsert_image(operation.name, ordinals);
        } else if (operation.type === "delete") {
            return ImageLoader.delete_image(operation.name);
        } else if (operation.type === "clear-description") {
            return ImageLoader.clear_image_description(operation.name);
        }
    }));
}

type LoadOperation = 
    | {type: "upsert", name: string}
    | {type: "clear-description", name: string}
    | {type: "delete", name: string}

async function get_load_operations(): Promise<Array<LoadOperation>> {
    const directory_changes = await Directory.get_changes();

    const operations = directory_changes.flatMap<LoadOperation>(change => {
        const image_change = find_image_change(change);
        if (!image_change) {
            return [];
        }

        if (change.type === "added" || change.type === "modified") {
            return [{type: "upsert", name: image_change.name}];
        } else if (image_change.type === "descr") {
            return [{type: "clear-description", name: image_change.name}];
        } else {
            return [{type: "delete", name: image_change.name}];
        }
    });

    return GenericUtil.unique_by_key(operations, operation => `${operation.name}:${operation.type}`);
}

function find_image_change(change: Directory.DirectoryChange): null | {name: string, type: "png" | "info" | "descr"} {
    if (!change.path.startsWith("/image")) {
        return null;
    }

    if (change.path.split("/").length !== 4) {
        return null;
    }

    const [, , name, file] = change.path.split("/");

    if (file === ImageLoader.image_file_name) {
        return {name, type: "png"};
    } else if (file === ImageLoader.info_file_name) {
        return {name, type: "info"};
    } else if (file === ImageLoader.description_file_name) {
        return {name, type: "descr"};
    } else {
        return null;
    }
}