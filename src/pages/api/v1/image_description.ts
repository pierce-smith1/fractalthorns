import * as ImageLoader from "../../../stores/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"image_description">(async (request, override) => {
    const name = request.name;

    const image = await ImageLoader.load_one(name);

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    return {description: image.description};
});