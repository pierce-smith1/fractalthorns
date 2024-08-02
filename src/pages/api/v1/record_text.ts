import * as Endpoint from "../../../endpoint";
import Records from "../../../stores/record";
import * as RecordTransformers from "../../../transformers/record";

export const GET = Endpoint.use_get_handler<"record_text">(async (request, override) => {
    const record_name = request.name;

    const record = Records.get().find(record => record.name === record_name);
    if (!record) {
        return override(new Response(null, {status: 404}));
    }

    return RecordTransformers.to_record_text(record);
});