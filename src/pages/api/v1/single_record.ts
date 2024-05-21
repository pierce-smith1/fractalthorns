import * as Endpoint from "../../../endpoint";
import * as EpisodicLoader from "../../../loaders/episodic";

export const GET = Endpoint.use_get_handler<"single_record">(async (request, override) => {
    const episodic = await EpisodicLoader.get();
    const name = request.name;

    const record = episodic.records
        .filter(record => record.solved)
        .find(record => record.name === name);

    if (!record) {
        return override(new Response(null, {status: 404}));
    }

    return record;
});