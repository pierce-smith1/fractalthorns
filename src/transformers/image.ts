import * as Images from "../stores/image";
import * as ImageHelpers from "../helpers/image";
import * as Api from "../api";

export function to_api_object(image: Images.Image): Api.ImageObject {
    const object = {
        name: image.name,
        title: image.title,
        date: image.date.toISOString().split("T")[0],
        ordinal: image.ordinal,
        image_url: `/serve/image/${image.name}`,
        thumb_url: `/serve/thumb/${image.name}`,
        has_description: !!image.description,
        canon: image.canon,
        characters: image.characters ?? [],
        speedpaint_video_url: image.speedpaint_video_id && ImageHelpers.speedpaint_id_to_url(image.speedpaint_video_id),
        primary_color: image.colors.primary,
        secondary_color: image.colors.secondary,
    };

    return object;
}