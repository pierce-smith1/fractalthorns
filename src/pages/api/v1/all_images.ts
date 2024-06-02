import * as ImageLoader from "../../../loaders/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_images">(async (request, override) => {
    const images = await ImageLoader.get_all();

    const client_images = images.map((image, i) => ({...image,
        ordinal: images.length - i,
        date: image.date.toString(),
    }));

    return client_images;
});