import * as Endpoint from "../../../endpoint";
import * as RecordQueries from "../../../queries/record";

export const GET = Endpoint.make_handler<"single_record">(async (request, override) => {
    const {name} = request;

    const record = name
        ? await RecordQueries.get_one_entry(name)
        : await RecordQueries.get_first_entry();

    if (!record) {
        return override(new Response(null, {status: 404}));
    }

    return record;
});