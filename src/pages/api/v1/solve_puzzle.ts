import * as Exp from "drizzle-orm/sqlite-core/expressions";

import Db from "../../../data/db";
import * as Schema from "../../../data/schema/schema";
import * as Endpoint from "../../../endpoint";

export const POST = Endpoint.make_handler<"solve_puzzle">(async (request, override) => {
    const {name, code} = request;

    const solve_result = await solve_one(name, code);
    switch (solve_result.type) {
        case "already-solved": return {unlocked_records: solve_result.unlocked_records};

        case "ok": {
            return {unlocked_records: solve_result.unlocked_records};
        }

        case "not-found": return override(new Response(null, {status: 404}));

        case "wrong-code": return override(new Response(null, {status: 400}));
    }
});

type SolveResult = 
    | {type: "not-found"}
    | {type: "wrong-code"}
    | {type: "already-solved", unlocked_records: Array<string>}
    | {type: "ok", unlocked_records: Array<string>}

export async function solve_one(name: string, code: string): Promise<SolveResult> {
    const puzzle_row = await Db.query.puzzle.findFirst({
        with: {
            puzzle_solve: {
                with: {
                    record: true,
                }
            },
            puzzle_linked_record: {
                with: {
                    record: true,
                }
            },
        },
        where: Exp.eq(Schema.puzzle.name, name),
    });

    if (!puzzle_row) {
        return {type: "not-found"};
    }

    if (puzzle_row.puzzle_solve.length > 0) {
        return {
            type: "already-solved", 
            unlocked_records: puzzle_row.puzzle_solve.map(x => x.record.name),
        };
    }

    if (code !== puzzle_row.solve_code) {
        return {type: "wrong-code"};
    }

    if (puzzle_row.solve_behavior === "linked") {
        await Db.insert(Schema.puzzle_solve).values(puzzle_row.puzzle_linked_record.map(x => ({
            puzzle_id: puzzle_row.id,
            record_id: x.record.id,
        })));

        return {
            type: "ok", 
            unlocked_records: puzzle_row.puzzle_linked_record.map(x => x.record.name),
        };
    } else if (puzzle_row.solve_behavior === "increment") {
        const chapter_record_rows = await Db.query.record.findMany({
            with: {
                puzzle_solve: true,
            },
            where: Exp.eq(Schema.record.chapter, puzzle_row.chapter),
        });

        const [next_to_discover] = chapter_record_rows
            .filter(x => !x.always_discovered && x.puzzle_solve.length === 0);

        await Db.insert(Schema.puzzle_solve).values({
            puzzle_id: puzzle_row.id,
            record_id: next_to_discover.id,
        });

        return {
            type: "ok",
            unlocked_records: [next_to_discover.name],
        };
    } else {
        throw new Error(`Unknown solve behavior for puzzle ${puzzle_row.name}: "${puzzle_row.solve_behavior}"`);
    }
}