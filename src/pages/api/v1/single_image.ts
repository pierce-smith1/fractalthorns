import * as ImageLoader from "../../../loaders/image";
import * as Image from "../../../descriptors/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"single_image">(async (request, override) => {
    const name = request.name;

    const all_images = await ImageLoader.get_all();
    const image = name ? all_images.find(image => image.name === name) : all_images[0];

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    return Image.to_public_model(image, all_images);
});
