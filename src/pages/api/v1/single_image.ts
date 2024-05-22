import * as ImageLoader from "../../../loaders/image";
import * as Endpoint from "../../../endpoint";

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

    const next_image_index = image_index - 1 >= 0 ?
        image_index - 1
        : 0;
    const prev_image_index = image_index + 1 < images.length ?
        image_index + 1
        : images.length - 1;

    const next_image_name = images[next_image_index].name;
    const prev_image_name = images[prev_image_index].name;

    const client_image = {...requested_image, 
        date: requested_image.date.toString(),
        ordinal: images.length - image_index,
        next_image: next_image_name,
        prev_image: prev_image_name,
    };
    return client_image;
});