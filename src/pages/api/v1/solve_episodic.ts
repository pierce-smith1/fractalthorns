import * as Endpoint from "../../../endpoint";
import * as EpisodicLoader from "../../../loaders/episodic";

export const POST = Endpoint.use_post_handler<"solve_episodic">(async (request, override) => {
    const episodic = await EpisodicLoader.get();

    const requested_record = await episodic.records.find(record => record.name === request.name);
    if (!requested_record) {
        return override(new Response(null, {status: 404}));
    }

    EpisodicLoader.solve(request.name, requested_record.chapter);
});