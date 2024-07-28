import * as ImageLoader from "../../../loaders/image";
import * as Image from "../../../descriptors/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_images">(async (request, override) => {
    const images = await ImageLoader.get_all();

    const client_images = images.map(image => Image.to_public_model(image));

    return {images: client_images};
});