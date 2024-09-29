import * as ImageLoader from "../../../loaders/image";
import * as ImageTransformers from "../../../transformers/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"single_image">(async (request, override) => {
    const name = request.name;

    const image = name
        ? await ImageLoader.load_one(name)
        : await ImageLoader.load_latest();

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    return ImageTransformers.to_api_object(image);
});
