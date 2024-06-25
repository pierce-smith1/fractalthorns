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

    const client_image = {
        name: image.name,
        title: image.title,
        date: image.date.toISOString().split("T")[0], // lol
        ordinal: all_images.length - all_images.findIndex(other => other.name === image.name), 
        image_url: image.image_url,
        thumb_url: image.thumb_url,
        canon: image.canon,
        characters: image.characters ?? [],
        description: image.description,
        speedpaint_video_url: image.speedpaint_video_id ? Image.speedpaint_id_to_url(image.speedpaint_video_id) : undefined,
    };
    return client_image;
});