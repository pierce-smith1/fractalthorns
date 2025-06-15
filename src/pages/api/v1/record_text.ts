import * as Endpoint from "../../../endpoint";
import * as RecordQueries from "../../../queries/record";

export const GET = Endpoint.make_handler<"record_text">(async (request, override) => {
    const {name} = request;

    const record_text = name 
        ? await RecordQueries.get_one_text(name)
        : await RecordQueries.get_first_text();

    if (!record_text) {
        return override(new Response(null, {status: 404}));
    }

    if (record_text === "unsolved") {
        return override(new Response(null, {status: 400}));
    }

    return record_text;
});