import * as Endpoint from "../../../endpoint";
import * as PuzzleQueries from "../../../queries/puzzle";

export const GET = Endpoint.make_handler<"single_puzzle">(async (request, override) => {
    const {name} = request;

    if (!name) {
        return override(new Response(null, {status: 400}));
    }

    const puzzle = await PuzzleQueries.get_one(name);

    if (!puzzle) {
        return override(new Response(null, {status: 404}));
    }

    return puzzle;
});