import * as ImageLoader from "../../../stores/image";
import * as ImageTransformers from "../../../transformers/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"single_image">(async (request, override) => {
    const name = request.name;

    const image = name
        ? await ImageLoader.load_one(name)
        : (await ImageLoader.load_all())[0];

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    return ImageTransformers.to_api_object(image);
});
