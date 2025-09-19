import * as Interfaces from "../interfaces";

export const image_object_schema = {
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
    has_description: {
        type: Interfaces.fields.required_boolean,
        description: "True if and only if the image has a description, i.e. a call to `image_description` will return a non-empty `description` field.",
    },
    characters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "The list of characters depicted in this image, including non-canon variants of those characters. May be empty.",
    },
    speedpaint_video_url: {
        type: Interfaces.fields.optional_string,
        description: "If it exists, the URL of the speedpaint for the image.",
    },
    primary_color: {
        type: Interfaces.fields.optional_string,
        description: "An approximation of the most dominant color in the image, in #RRGGBB format. The calculation does not take into account low-saturation colors, so this may be omitted if there are no sufficiently saturated colors in the image.",
    },
    secondary_color: {
        type: Interfaces.fields.optional_string,
        description: "An approximation of the second most dominant color in the image, in #RRGGBB format. The calculation does not take into account low-saturation colors, so this may be omitted if there are no sufficiently saturated colors in the image.",
    },
    remarks: {
        type: Interfaces.fields.optional_string,
        description: "Comments about the image itself, in markdown-formatted text. This is used for additional real-world context about the image, such as crediting depicted characters.",
    }
};

export const single_image_request_schema = {
    name: {
        type: Interfaces.fields.optional_string,
        description: "The name of the image to get info for. Defaults to the name of the latest image.",
    },
} as const;

export const single_image_endpoint = {
    description: "Get metadata for a single image.",
    request: single_image_request_schema,
    response: image_object_schema,
} as const;

export const all_images_request_schema = {} as const;

export const all_images_response_schema = {
    images: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(image_object_schema)),
        description: "A list of every image, sorted newest to oldest.",
    },
} as const;

export const all_images_endpoint = {
    description: "Get metadata for all images.",
    request: all_images_request_schema,
    response: all_images_response_schema,
} as const;

export const named_image_request_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of the image to get info for.",
    },
} as const;

export const image_description_response_schema = {
    description: {
        type: Interfaces.fields.optional_string,
        description: "The full description of the image, in Markdown format. Not present if the image doesn't have a description yet.",
    }
} as const;

export const image_description_endpoint = {
    description: "Get the description for an image.",
    request: named_image_request_schema,
    response: image_description_response_schema,
} as const;

export type ImageObject = Interfaces.TypeFromSchema<typeof image_object_schema>;
export type SingleImageRequest = Interfaces.TypeFromSchema<typeof single_image_request_schema>;
export type NamedImageRequest = Interfaces.TypeFromSchema<typeof named_image_request_schema>;
export type AllImagesRequest = Interfaces.TypeFromSchema<typeof all_images_request_schema>;
