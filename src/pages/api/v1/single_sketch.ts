import * as Endpoint from "../../../endpoint";
import * as SketchQueries from "../../../queries/sketch";

export const GET = Endpoint.make_handler<"single_sketch">("single_sketch", async (request, override) => {
    const {name} = request;

    const sketch = name
        ? await SketchQueries.get_one(name)
        : await SketchQueries.get_latest();

    if (!sketch) {
        return override(new Response(null, {status: 404}));
    }

    return sketch;
});
