import * as Endpoint from "../../../endpoint";
import * as PuzzleQueries from "../../../queries/puzzle";

export const GET = Endpoint.make_handler<"single_puzzle">("single_puzzle", async (request, override) => {
    const {name} = request;

    const puzzle = name
        ? await PuzzleQueries.get_one(name)
        : await PuzzleQueries.get_first_unsolved();

    if (!puzzle) {
        return override(new Response(null, {status: 404}));
    }

    return puzzle;
});
