import Images from "../../../stores/image";
import * as ImageTranformers from "../../../transformers/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_images">(async (request, override) => {
    const images = Images.get();

    const client_images = images
        .toSorted((a, b) => b.date.valueOf() - a.date.valueOf())
        .map(image => ImageTranformers.to_api_object(image));

    return {images: client_images};
});