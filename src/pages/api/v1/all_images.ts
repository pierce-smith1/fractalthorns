import * as ImageLoader from "../../../loaders/image";
import * as PublicImage from "../../../descriptors/public/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_images">(async (request, override) => {
    const images = await ImageLoader.get_all();

    const client_images = images.map(image => PublicImage.to_public_model(image, images));

    return {images: client_images};
});