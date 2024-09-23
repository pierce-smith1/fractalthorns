import * as ImageLoader from "../../../stores/image";
import * as ImageTranformers from "../../../transformers/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_images">(async (request, override) => {
    const images = await ImageLoader.load_all();

    const client_images = images
        .map(image => ImageTranformers.to_api_object(image));

    return {images: client_images};
});