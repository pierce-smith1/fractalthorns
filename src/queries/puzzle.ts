import * as Api from "../api/api"
import Db from "../data/db"
import * as Util from "../genericutil"
import * as QueryUtil from "./util"

export type BasePuzzle = Api.PuzzleObject;

const base_puzzle = QueryUtil.make_base_query(Db
    .selectFrom("puzzle")
    .leftJoin("puzzle_solve", "puzzle_solve.puzzle_id", "puzzle.id")
    .leftJoin("puzzle_linked_record", "puzzle_linked_record.puzzle_id", "puzzle.id")
    .leftJoin("record", "record.name", "puzzle_linked_record.record_name")
    .select([
        "puzzle.id as puzzle_id",
        "puzzle.name as puzzle_name",
        "puzzle.chapter as puzzle_chapter",
        "puzzle.solve_behavior as puzzle_solve_behavior",
        "puzzle.solve_code as puzzle_solve_code",
        "puzzle.primary_color as puzzle_primary_color",
        "puzzle.secondary_color as puzzle_secondary_color",
        "puzzle.type as puzzle_type",
        "puzzle.ordinal as puzzle_ordinal",
        "puzzle_solve.record_id as puzzle_solve_record_id",
        "puzzle_linked_record.record_name as puzzle_linked_record_name",
        "record.name as solved_record_name",
    ]),
    (representative, rows) => ({
        solved: Util.undefined_if_all_null(rows.map(x => x.solved_record_name)),
        name: representative.puzzle_name,
        chapter: representative.puzzle_chapter,
        solve_behavior: {
            type: representative.puzzle_solve_behavior,
            linked_records: Util.undefined_if_all_null(rows.map(x => x.puzzle_linked_record_name)),
        },
        type: representative.puzzle_type,
        primary_color: representative.puzzle_primary_color ?? "#FFFFFF",
        secondary_color: representative.puzzle_secondary_color ?? "#000000",
    })
);

export async function get_all(): Promise<Array<BasePuzzle>> {
    const rows = await base_puzzle.query.execute();

    const puzzles = QueryUtil.coalesce_rows({
        rows,
        get_key: row => row.puzzle_id,
        merge: base_puzzle.merge_fn,
    });

    return puzzles;
}

export async function get_one(name: string): Promise<BasePuzzle> {
    const rows = await base_puzzle.query
        .where("puzzle.name", "=", name)
        .execute();

    const puzzle = QueryUtil.coalesce_to_one({
        rows,
        merge: base_puzzle.merge_fn,
    });

    return puzzle;
}

export async function get_first_unsolved(): Promise<BasePuzzle> {
    const rows = await base_puzzle.query
        .orderBy("puzzle.ordinal", "asc")
        .execute();

    const puzzles = QueryUtil.coalesce_rows({
        rows,
        get_key: row => row.puzzle_id,
        merge: base_puzzle.merge_fn,
    });

    const [first_unsolved] = puzzles.filter(x => !x.solved);
    const puzzle = first_unsolved ?? puzzles[0];

    return puzzle;
}
