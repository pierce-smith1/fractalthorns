import * as Kysely from "kysely"

import * as Api from "../api/api"
import Db from "../data/db"
import * as Util from "../genericutil"
import * as QueryUtil from "./util"

export type BasePuzzle = Api.PuzzleObject;

export async function get_all(): Promise<Array<BasePuzzle>> {
    const rows = await base_puzzle_query().execute();

    const objects = QueryUtil.coalesce_rows({
        rows,
        get_key: row => row.puzzle_id,
        merge: merge_base_query_rows(),
    });

    return objects;
}

export async function get_one(name: string): Promise<BasePuzzle> {
    const rows = await base_puzzle_query()
        .where("puzzle.name", "=", name)
        .execute();

    const object = QueryUtil.coalesce_to_one({rows, merge: merge_base_query_rows()});
    return object;
}

export async function get_first_unsolved(): Promise<BasePuzzle> {
    const rows = await base_puzzle_query()
        .orderBy("puzzle.ordinal", "asc")
        .execute();

    const objects = QueryUtil.coalesce_rows({
        rows,
        get_key: row => row.puzzle_id,
        merge: merge_base_query_rows(),
    });

    const [first_unsolved] = objects.filter(x => !x.solved);
    const puzzle = first_unsolved ?? objects[0];

    return puzzle;
}

function base_puzzle_query() {
    return Db
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
        ]);
}

type BaseQueryRow = Kysely.InferResult<ReturnType<typeof base_puzzle_query>>[number];

function merge_base_query_rows() {
    return (representative: BaseQueryRow, rows: Array<BaseQueryRow>): BasePuzzle => ({
        solved: Util.undefined_if_empty(Util.non_null(rows.map(x => x.solved_record_name))),
        name: representative.puzzle_name,
        chapter: representative.puzzle_chapter,
        solve_behavior: {
            type: representative.puzzle_solve_behavior,
            linked_records: Util.undefined_if_empty(Util.non_null(rows.map(x => x.puzzle_linked_record_name))),
        },
        type: representative.puzzle_type,
        primary_color: representative.puzzle_primary_color ?? "#FFFFFF",
        secondary_color: representative.puzzle_secondary_color ?? "#000000",
    });
}
