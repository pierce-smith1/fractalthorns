import * as Endpoint from "../../../endpoint";
import * as PuzzleQueries from "../../../queries/puzzle";

export const GET = Endpoint.make_handler<"all_puzzles">(async (request, override) => {
    const puzzles = await PuzzleQueries.get_all();

    const rows_by_chapter = Object.groupBy(puzzles, puzzle => puzzle.chapter);

    const chapters = Object.entries(rows_by_chapter).map(([chapter_name, puzzles]) => ({
        name: chapter_name,
        puzzles: puzzles ?? [],
    }));

    return {chapters};
});