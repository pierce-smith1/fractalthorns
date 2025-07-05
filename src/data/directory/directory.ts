import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";

export type DirectoryListing = Array<{
    path: string, 
    modified_ms: number,
}>;

export async function load_db_directory(): Promise<DirectoryListing> {
    const rows = await Db
        .selectFrom("directory")
        .selectAll()
        .execute();

    return rows;
}

export async function load_fs_directory(): Promise<DirectoryListing> {
    const directory_listing: DirectoryListing = [];
    
    const {content_root} = Config;

    async function load_from(path: string) {
        const entries = await Filesystem.enumerate(`${content_root}/${path}`);

        for (const entry of entries) {
            const entry_path = `${path}/${entry.name}`;

            if (entry.type === "Directory") {
                await load_from(entry_path);
            } else if (entry.type === "File") {
                const modified_ms = await Filesystem.get_modified_ms(`${content_root}/${entry_path}`);
                directory_listing.push({path: entry_path, modified_ms});
            }
        }
    }

    await load_from("");
    return directory_listing;
}

export type DirectoryChange = {
    path: string, 
    type: "added" | "modified" | "removed",
};

export async function get_changes(): Promise<Array<DirectoryChange>> {
    const db_directory = await load_db_directory();
    const fs_directory = await load_fs_directory();

    const changes: Array<DirectoryChange> = [];

    for (const fs_entry of fs_directory) {
        const db_entry = db_directory.find(x => x.path === fs_entry.path);

        if (!db_entry) {
            changes.push({path: fs_entry.path, type: "added"});
        } else if (fs_entry.modified_ms > db_entry.modified_ms) {
            changes.push({path: fs_entry.path, type: "modified"});
        }
    }

    const deleted_entries = db_directory.filter(db_entry => !fs_directory.find(fs_entry => db_entry.path === fs_entry.path));
    for (const deleted_entry of deleted_entries) {
        changes.push({path: deleted_entry.path, type: "removed"});
    }

    return changes;
}
