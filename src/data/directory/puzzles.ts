import * as Directory from "./directory";
import * as PuzzlesLoader from "../loaders/puzzle";

export async function detect_and_resolve_changes() {
    const directory_changes = await Directory.get_changes();

    const puzzles_change = directory_changes.find(change => change.path === "/puzzles/puzzles.json");
    if (!puzzles_change) {
        console.log("No puzzles changes detected");
        return;
    }

    console.log("Repopulating puzzles");
    return PuzzlesLoader.regenerate_puzzles();
}