import * as Endpoint from "../../../endpoint";
import Records from "../../../stores/record";
import * as RecordTransformers from "../../../transformers/record";

export const GET = Endpoint.use_get_handler<"single_record">(async (request, override) => {
    const name = request.name;

    const record = Records.get().find(record => record.name === name);

    if (!record) {
        return override(new Response(null, {status: 404}));
    }

    return RecordTransformers.to_redactable_entry(record);
});