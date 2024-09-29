import * as Endpoint from "../../../endpoint";
import * as RecordLoader from "../../../loaders/record";
import * as RecordTransformers from "../../../transformers/record";

export const GET = Endpoint.use_get_handler<"single_record">(async (request, override) => {
    const name = request.name;

    const record = await RecordLoader.load_one(name);
    if (!record) {
        return override(new Response(null, {status: 404}));
    }

    return RecordTransformers.to_redactable_entry(record);
});