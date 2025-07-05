import Db from "./db";
import * as ImageDirectory from "./directory/image";
import * as NewsDirectory from "./directory/news";
import * as PuzzlesDirectory from "./directory/puzzles";
import * as RecordDirectory from "./directory/record";
import * as RuneDirectory from "./directory/rune";
import * as SketchDirectory from "./directory/sketch";
import * as DirectoryLoader from "./loaders/directory";

export async function repopulate(fully_recreate: boolean) {
    if (fully_recreate) {
        console.log("Deleting authorland...");

        await Promise.all([
            Db.deleteFrom("directory").execute(),
            Db.deleteFrom("image").execute(),
            Db.deleteFrom("news").execute(),
            Db.deleteFrom("news_item").execute(),
            Db.deleteFrom("puzzle").execute(),
            Db.deleteFrom("puzzle_linked_record").execute(),
            Db.deleteFrom("record").execute(),
            Db.deleteFrom("record_header_line").execute(),
            Db.deleteFrom("record_line").execute(),
            Db.deleteFrom("rune").execute(),
            Db.deleteFrom("runeword").execute(),
            Db.deleteFrom("runeword_rune").execute(),
            Db.deleteFrom("sketch").execute(),
        ]);
    }

    await Promise.all([
        ImageDirectory.detect_and_resolve_changes(),
        NewsDirectory.detect_and_resolve_changes(),
        SketchDirectory.detect_and_resolve_changes(),
        RecordDirectory.detect_and_resolve_changes(),
        RuneDirectory.detect_and_resolve_changes(),
        PuzzlesDirectory.detect_and_resolve_changes(),
    ]);

    await DirectoryLoader.repopulate();
}

await repopulate(process.argv.includes("--fully-recreate"));
