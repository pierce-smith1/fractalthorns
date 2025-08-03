import * as Endpoint from "../../../endpoint";
import * as SketchQueries from "../../../queries/sketch";

export const GET = Endpoint.make_handler<"all_sketches">("all_sketches", async (_request, _override) => {
    const sketches = await SketchQueries.get_all();
    return {sketches};
});
