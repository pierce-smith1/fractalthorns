import * as Interfaces from "../../interfaces";

export const single_image_request = {
    name: {
        type: Interfaces.fields.optional_string,
        description: "The name of the image to get info for. Defaults to the name of the latest image.",
    },
} as const;
export type SingleImageRequest = Interfaces.ModelFromInterface<typeof single_image_request>;

export const all_images_request = {} as const;
export type AllImagesRequest = Interfaces.ModelFromInterface<typeof all_images_request>;

export const image_response = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The identifying name of the image, i.e. the one found in URLs",
    },
    title: {
        type: Interfaces.fields.required_string,
        description: "The display title of the image",
    },
    date: {
        type: Interfaces.fields.required_string,
        description: "The date the image was made in ISO 8601 YYYY-MM-DD format",
    },
    ordinal: {
        type: Interfaces.fields.required_number,
        description: "The 1-based index of the image from oldest to newest, i.e. the \"#n\" displayed on the site",
    },
    image_url: {
        type: Interfaces.fields.required_string,
        description: "The URL the image data can be requested from",
    },
    thumb_url: {
        type: Interfaces.fields.required_string,
        description: "The URL the image's thumbnail data can be requested from",
    },
    canon: {
        type: Interfaces.fields.optional_string,
        description: `If applicable, the iteration the image depicts`,
    },
    characters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of characters depicted in this image, including non-canon variants of those characters. May be empty.",
    },
    description: {
        type: Interfaces.fields.optional_string,
        description: "The description of the image, in Markdown format.",
    },
    speedpaint_video_url: {
        type: Interfaces.fields.optional_string,
        description: "If it exists, the URL of the speedpaint for the image.",
    },
};
export type ImageResponse = Interfaces.ModelFromInterface<typeof image_response>;

export function get_date_string(image_date: string | Date) {
    const date = new Date(image_date);
    const formatted_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formatted_date;
}
