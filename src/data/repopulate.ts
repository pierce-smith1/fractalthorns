import Db from "./db";
import * as ImageDirectory from "./directory/image";
import * as NewsDirectory from "./directory/news";
import * as PuzzlesDirectory from "./directory/puzzles";
import * as RecordDirectory from "./directory/record";
import * as RuneDirectory from "./directory/rune";
import * as SketchDirectory from "./directory/sketch";
import * as DirectoryLoader from "./loaders/directory";

export async function repopulate() {
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

await repopulate();