import Db from "./db";
import * as DirectoryLoader from "./loaders/directory";
import * as ImageDirectory from "./directory/image";
import * as NewsDirectory from "./directory/news";
import * as SketchDirectory from "./directory/sketch";
import * as RecordDirectory from "./directory/record";
import * as RuneDirectory from "./directory/rune";
import * as NewsLoader from "./loaders/news";
import * as RecordLoader from "./loaders/record";
import * as SketchLoader from "./loaders/sketch";
import * as PuzzleLoader from "./loaders/puzzle";
import * as RuneLoader from "./loaders/rune";
import * as Schema from "./schema/schema";

export async function repopulate() {
    /*
    await Promise.all([
        //Db.delete(Schema.image),
        Db.delete(Schema.news),
        Db.delete(Schema.news_item),
        Db.delete(Schema.sketch),
        Db.delete(Schema.record),
        Db.delete(Schema.record_header_line),
        Db.delete(Schema.record_line),
        Db.delete(Schema.puzzle),
        Db.delete(Schema.puzzle_linked_record),
        Db.delete(Schema.rune),
        Db.delete(Schema.runeword),
        Db.delete(Schema.runeword_rune),
    ]);

    await Promise.all([
        //ImageLoader.populate(),
        SketchLoader.populate(),
        NewsLoader.populate(),
        RecordLoader.populate(),
        PuzzleLoader.populate(),
        RuneLoader.populate(),
    ]);
    */

    await Promise.all([
        ImageDirectory.detect_and_resolve_changes(),
        NewsDirectory.detect_and_resolve_changes(),
        SketchDirectory.detect_and_resolve_changes(),
        RecordDirectory.detect_and_resolve_changes(),
        RuneDirectory.detect_and_resolve_changes(),
    ]);

    await DirectoryLoader.repopulate();
}

await repopulate();