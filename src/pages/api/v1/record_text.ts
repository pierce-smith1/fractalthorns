import * as Endpoint from "../../../endpoint";
import * as RecordLoader from "../../../loaders/record";
import * as EpisodicLoader from "../../../loaders/episodic";

export const GET = Endpoint.use_get_handler<"record_text">(async (request, override) => {
    const record_name = request.name;

    const episodic = await EpisodicLoader.get()
    const record_entry = episodic.records
        .filter(record => record.solved)
        .find(record => record.name === record_name);

    if (!record_entry) {
        return override(new Response(null, {status: 404}));
    }

    const record = await RecordLoader.get(record_name, record_entry.chapter);
    return record;
});