import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";

export type PuzzlesDefinition = Array<{
    chapter: string,
    puzzles: Array<{
        name: string,
        solve_behavior: 
            | {type: "increment"}
            | {type: "linked", linked_records: Array<string>},
        solve_code: string,
        primary_color?: string,
        secondary_color?: string,
    }>,
}>;

export async function get_puzzles_definition(): Promise<PuzzlesDefinition> {
    const puzzles_definition_path = `${Config.content_root}/puzzles/puzzles.json`;
    const puzzles_definition = JSON.parse(await Filesystem.read(puzzles_definition_path)) as PuzzlesDefinition;

    return puzzles_definition;
}

export async function regenerate_puzzles() {
    const puzzles_definition_path = `${Config.content_root}/puzzles/puzzles.json`;
    const puzzles_definition = JSON.parse(await Filesystem.read(puzzles_definition_path)) as PuzzlesDefinition;

    return Promise.all(puzzles_definition.map(async ({chapter, puzzles}) =>
        Promise.all(puzzles.map(async puzzle_entry => {
            const chapter_root = `${Config.content_root}/puzzles/chapter-${chapter}`;

            const [puzzle_file] = (await Filesystem.enumerate(chapter_root))
                .filter(entry => entry.type === "File")
                .filter(entry => entry.name.startsWith(puzzle_entry.name));

            const [_, extension] = puzzle_file.name.split(".");
            const type = (() => {
                if (extension === "js" || extension === "ts") {
                    return "script"
                } else if (extension === "png") {
                    return "image";
                } else {
                    throw new Error(`Unexpected puzzle extension "${extension}"`);
                }
            })();

            const ordinal = puzzles.findIndex(entry => puzzle_entry.name === entry.name) + 1;

            const puzzle_row = await Db
                .insertInto("puzzle")
                .values({
                    name: puzzle_entry.name,
                    chapter,
                    solve_behavior: puzzle_entry.solve_behavior.type,
                    solve_code: puzzle_entry.solve_code,
                    primary_color: puzzle_entry.primary_color,
                    secondary_color: puzzle_entry.secondary_color,
                    type,
                    ordinal,
                })
                .returning(["id"])
                .executeTakeFirstOrThrow();

            if (puzzle_entry.solve_behavior.type === "linked") {
                await Promise.all(puzzle_entry.solve_behavior.linked_records.map(record_name => Db
                    .insertInto("puzzle_linked_record")
                    .values({
                        record_name,
                        puzzle_id: puzzle_row.id,
                    })
                    .execute()
                ));
            }

            console.log(`Added puzzle ${puzzle_entry.name}`);
        }))
    ));
}
