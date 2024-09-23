import * as Endpoint from "../../../endpoint";
import * as SketchLoader from "../../../stores/sketch";
import * as SketchTransformers from "../../../transformers/sketch";

export const GET = Endpoint.use_get_handler<"all_sketches">(async (request, override) => {
    const sketches = await SketchLoader.load_all();
    
    const client_sketches = sketches.map(SketchTransformers.to_api_object);

    return {sketches: client_sketches};
});