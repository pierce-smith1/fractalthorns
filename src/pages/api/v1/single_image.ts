import * as ImageLoader from "../../../loaders/image";
import * as Endpoint from "../../../endpoint";
import * as GenericUtil from "../../../genericutil";

export const GET = Endpoint.use_get_handler<"single_image">(async (request, override) => {
    const images = await ImageLoader.get_all();
    const name = request.name;

    const requested_image = name ?
        images.find(image => image.name === name)
        : images[0];

    if (!requested_image) {
        return override(new Response(null, {status: 404}));
    }

    const image_index = images.findIndex(image => image.name === name);
    const [next_image, prev_image] = GenericUtil.neighbors(image_index, images);

    const client_image = {...requested_image, 
        date: requested_image.date.toString(),
        ordinal: images.length - image_index,
        next_image: next_image.name,
        prev_image: prev_image.name,
    };
    return client_image;
});