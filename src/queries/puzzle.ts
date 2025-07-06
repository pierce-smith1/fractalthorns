import * as Api from "../api/api"
import Db from "../data/db"
import * as Util from "../genericutil"
import * as QueryUtil from "./util"
import * as RecordQueries from "./record"

export type BasePuzzle = Api.PuzzleObject;

const base_puzzle = QueryUtil.make_base_query(Db
    .selectFrom("puzzle")
    .leftJoin("puzzle_solve", "puzzle_solve.puzzle_name", "puzzle.name")
    .leftJoin("puzzle_linked_record", "puzzle_linked_record.puzzle_id", "puzzle.id")
    .leftJoin("record", "record.name", "puzzle_solve.record_name")
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
    const rows = await base_puzzle.query
        .orderBy("puzzle.ordinal", "asc")
        .execute();

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

type SolveResult =
    | {type: "not-found"}
    | {type: "wrong-code"}
    | {type: "already-solved", unlocked_records: Array<string>}
    | {type: "ok", unlocked_records: Array<string>}

export async function solve_puzzle(name: string, code: string): Promise<SolveResult> {
    const solve_rows = await Db
        .selectFrom("puzzle")
        .leftJoin("puzzle_solve", "puzzle_solve.puzzle_name", "puzzle.name")
        .leftJoin("puzzle_linked_record", "puzzle_linked_record.puzzle_id", "puzzle.id")
        .leftJoin("record", "record.name", "puzzle_solve.record_name")
        .select([
            "puzzle.id as puzzle_id",
            "puzzle.name as puzzle_name",
            "puzzle.chapter as puzzle_chapter",
            "record.name as unlocked_record_name",
            "record.id as unlocked_record_id",
            "puzzle.solve_code as puzzle_solve_code",
            "puzzle.solve_behavior as puzzle_solve_behavior",
            "puzzle_linked_record.record_name as linked_record_name",
        ])
        .where("puzzle.name", "=", name)
        .execute();

    if (solve_rows.length === 0) {
        return {type: "not-found"};
    }

    const solve_info = QueryUtil.coalesce_to_one({
        rows: solve_rows,
        merge: (representative, rows) => ({
            puzzle_id: representative.puzzle_id,
            puzzle_name: representative.puzzle_name,
            puzzle_chapter: representative.puzzle_chapter,
            solve_code: representative.puzzle_solve_code,
            solve_behavior: representative.puzzle_solve_behavior,
            unlocked_records: Util.non_null(rows.map(x => (x.unlocked_record_name && x.unlocked_record_id)
                ? {
                    name: x.unlocked_record_name!,
                    id: x.unlocked_record_id!,
                }
                : null
            )),
            linked_records: Util.non_null(rows.map(x => x.linked_record_name)),
        }),
    });

    if (solve_info.unlocked_records.length > 0) {
        return {
            type: "already-solved",
            unlocked_records: solve_info.unlocked_records.map(x => x.name),
        };
    }

    if (solve_info.solve_code !== code) {
        return {type: "wrong-code"};
    }

    if (solve_info.solve_behavior === "linked") {
        await Db
            .insertInto("puzzle_solve")
            .values(solve_info.unlocked_records.map(x => ({
                puzzle_name: name,
                record_name: x.name,
            })))
            .execute();

        return {
            type: "ok",
            unlocked_records: solve_info.unlocked_records.map(x => x.name),
        };
    } else if (solve_info.solve_behavior === "increment") {
        const chapter_record_rows = await Db
            .selectFrom("record")
            .leftJoin("puzzle_solve", "puzzle_solve.record_name", "record.name")
            .select([
                "record.id as record_id",
                "record.name as record_name",
                "record.always_discovered as record_always_discovered",
                "puzzle_solve.puzzle_name as solving_puzzle_name",
            ])
            .where("record.chapter", "=", solve_info.puzzle_chapter)
            .orderBy("record.ordinal", "asc")
            .execute();

        const [next_to_discover] = chapter_record_rows
            .filter(x => !RecordQueries.is_solved(x));

        await Db
            .insertInto("puzzle_solve")
            .values({
                puzzle_name: solve_info.puzzle_name,
                record_name: next_to_discover.record_name,
            })
            .execute();

        return {
            type: "ok",
            unlocked_records: [next_to_discover.record_name],
        };
    } else {
        throw new Error(`Unknown solve behavior for puzzle ${name}: "${solve_info.solve_behavior}"`);
    }
}
