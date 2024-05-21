import * as ImageLoader from "../../../loaders/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_images">(async (request, override) => {
    const image = await ImageLoader.get_all();
    return image;
});