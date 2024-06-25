import * as Interfaces from "../../interfaces";
import * as Image from "../image";

export const single_image_request = {
    name: {
        type: Interfaces.fields.optional_string,
        description: "The name of the image to get info for. Defaults to the name of the latest image.",
    },
} as const;
export type SingleImageRequest = Interfaces.ModelFromInterface<typeof single_image_request>;

export const named_image_request = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of the image to get info for.",
    },
} as const;
export type NamedImageRequest = Interfaces.ModelFromInterface<typeof named_image_request>;

export const all_images_request = {} as const;
export type AllImagesRequest = Interfaces.ModelFromInterface<typeof all_images_request>;

export const image_response = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The identifying name of the image. This is the name used in URLs.",
    },
    title: {
        type: Interfaces.fields.required_string,
        description: "The display title of the image.",
    },
    date: {
        type: Interfaces.fields.required_string,
        description: "The date the image was made in ISO 8601 YYYY-MM-DD format.",
    },
    ordinal: {
        type: Interfaces.fields.required_number,
        description: "The 1-based index of the image from oldest to newest, i.e. the \"#n\" displayed on the site.",
    },
    image_url: {
        type: Interfaces.fields.required_string,
        description: "The URL (relative to the root of the server) the image data can be requested from.",
    },
    thumb_url: {
        type: Interfaces.fields.required_string,
        description: "The URL (relative to the root of the server) the image's thumbnail data can be requested from.",
    },
    canon: {
        type: Interfaces.fields.optional_string,
        description: `If applicable, the iteration the image depicts.`,
    },
    characters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of characters depicted in this image, including non-canon variants of those characters. May be empty.",
    },
    speedpaint_video_url: {
        type: Interfaces.fields.optional_string,
        description: "If it exists, the URL of the speedpaint for the image.",
    },
};
export type ImageResponse = Interfaces.ModelFromInterface<typeof image_response>;

export function to_public_model(image: Image.Model, all_images: Array<Image.Model>): ImageResponse {
    const client_image = {
        name: image.name,
        title: image.title,
        date: image.date.toISOString().split("T")[0], // lol
        ordinal: all_images.length - all_images.findIndex(other => other.name === image.name), 
        image_url: image.image_url,
        thumb_url: image.thumb_url,
        canon: image.canon,
        characters: image.characters ?? [],
        speedpaint_video_url: image.speedpaint_video_id ? Image.speedpaint_id_to_url(image.speedpaint_video_id) : undefined,
    };
    return client_image;
}

export function get_date_string(image_date: string | Date) {
    const date = new Date(image_date);
    const formatted_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formatted_date;
}
