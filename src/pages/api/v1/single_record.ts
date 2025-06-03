import * as Endpoint from "../../../endpoint";
import * as RecordQueries from "../../../queries/record";

export const GET = Endpoint.make_handler<"single_record">(async (request, override) => {
    const {name} = request;

    if (!name) {
        return override(new Response(null, {status: 400}));
    }

    const record = await RecordQueries.get_one_entry(name);

    if (!record) {
        return override(new Response(null, {status: 404}));
    }

    return record;
});