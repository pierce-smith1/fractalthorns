import * as Exp from "drizzle-orm/sqlite-core/expressions";

import * as Api from "../api/api";
import Db from "../data/db";
import * as Schema from "../data/schema/schema";

const base_query = {
    with: {
        puzzle_linked_record: true,
        puzzle_solve: {
            with: {
                record: {
                    columns: {
                        name: true,
                    },
                },
            },
        },
    },
} as const;

type BaseQueryRow = Exclude<Awaited<ReturnType<typeof Db.query.puzzle.findFirst<typeof base_query>>>, undefined>;

export async function get_all(): Promise<Array<Api.PuzzleObject>> {
    const rows = await Db.query.puzzle.findMany({
        ...base_query,
        orderBy: Exp.asc(Schema.puzzle.ordinal),
    });

    const puzzles = rows.map(to_api_object);
    return puzzles;
}

export async function get_one(name: string): Promise<Api.PuzzleObject | null> {
    const row = await Db.query.puzzle.findFirst({
        ...base_query,
        where: Exp.eq(Schema.puzzle.name, name),
    });

    if (!row) {
        return null;
    }

    return to_api_object(row);
}

function to_api_object(row: BaseQueryRow): Api.PuzzleObject {
    const puzzle = {
        name: row.name,
        solved: row.puzzle_solve.length > 0 ? row.puzzle_solve.map(x => x.record.name) : undefined,
        chapter: row.chapter,
        solve_behavior: {
            type: row.solve_behavior,
            linked_records: row.solve_behavior === "linked" ? row.puzzle_linked_record.map(x => x.record_name) : undefined,
        },
        type: row.type,
        primary_color: row.primary_color ?? "#FFFFFF",
        secondary_color: row.secondary_color ?? "#000000",
    };

    return puzzle;
}