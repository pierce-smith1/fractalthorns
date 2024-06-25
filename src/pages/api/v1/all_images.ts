import * as ImageLoader from "../../../loaders/image";
import * as Image from "../../../descriptors/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_images">(async (request, override) => {
    const images = await ImageLoader.get_all();

    const client_images = images.map((image, i) => ({
        name: image.name,
        title: image.title,
        date: image.date.toISOString().split("T")[0], // lol
        ordinal: images.length - i, 
        image_url: image.image_url,
        thumb_url: image.thumb_url,
        canon: image.canon,
        characters: image.characters ?? [],
        description: image.description,
        speedpaint_video_url: image.speedpaint_video_id ? Image.speedpaint_id_to_url(image.speedpaint_video_id) : undefined,
    }));

    return {images: client_images};
});