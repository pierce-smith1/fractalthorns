import Db from "./db";
import * as ImageDirectory from "./directory/image";
import * as NewsDirectory from "./directory/news";
import * as PuzzlesDirectory from "./directory/puzzles";
import * as RecordDirectory from "./directory/record";
import * as RuneDirectory from "./directory/rune";
import * as SketchDirectory from "./directory/sketch";
import * as DirectoryLoader from "./loaders/directory";
import * as Schema from "./schema/schema";

export async function repopulate(fully_recreate: boolean) {
    if (fully_recreate) {
        console.log("Deleting authorland...");
        await Promise.all([
            Db.delete(Schema.directory),
            Db.delete(Schema.image),
            Db.delete(Schema.news),
            Db.delete(Schema.news_item),
            Db.delete(Schema.puzzle),
            Db.delete(Schema.puzzle_linked_record),
            Db.delete(Schema.record),
            Db.delete(Schema.record_header_line),
            Db.delete(Schema.record_line),
            Db.delete(Schema.rune),
            Db.delete(Schema.runeword),
            Db.delete(Schema.runeword_rune),
            Db.delete(Schema.sketch),
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