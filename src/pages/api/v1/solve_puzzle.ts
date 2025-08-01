import * as Endpoint from "../../../endpoint"
import * as PuzzleQueries from "../../../queries/puzzle"

export const POST = Endpoint.make_handler<"solve_puzzle">("solve_puzzle", async (request, override) => {
    const {name, code} = request;

    const solve_result = await PuzzleQueries.solve_puzzle(name, code);
    switch (solve_result.type) {
        case "already-solved": return {unlocked_records: solve_result.unlocked_records};

        case "ok": {
            return {unlocked_records: solve_result.unlocked_records};
        }

        case "not-found": return override(new Response(null, {status: 404}));

        case "wrong-code": return override(new Response(null, {status: 400}));
    }
});
