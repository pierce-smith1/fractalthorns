import * as Interfaces from "../interfaces";

export const sketch_object_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The sketch's name for identification purposes, such as for URLs.",
    },
    title: {
        type: Interfaces.fields.required_string,
        description: "The sketch's name for display purposes. Currently unused on the site.",
    },
    characters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "The list of characters depicted in this sketch. May be empty.",
    },
    image_url: {
        type: Interfaces.fields.required_string,
        description: "The URL (relative to the root of the server) the image data can be requested from.",
    },
    thumb_url: {
        type: Interfaces.fields.required_string,
        description: "The URL (relative to the root of the server) the thumbnail data can be requested from.",
    },
    primary_color: {
        type: Interfaces.fields.optional_string,
        description: "An approximation of the most dominant color in the image, in #RRGGBB format. The calculation does not take into account low-saturation colors, so this may be omitted if there are no sufficiently saturated colors in the image."
    },
    secondary_color: {
        type: Interfaces.fields.optional_string,
        description: "An approximation of the second most dominant color in the image, in #RRGGBB format. The calculation does not take into account low-saturation colors, so this may be omitted if there are no sufficiently saturated colors in the image."
    },
} as const;

export const all_sketches_request_schema = {} as const;

export const all_sketches_response_schema = {
    sketches: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(sketch_object_schema)),
        description: "A list of all sketches, from newest to oldest."
    },
} as const;

export const all_sketches_endpoint = {
    description: "Get info for all sketches.",
    request: all_sketches_request_schema,
    response: all_sketches_response_schema,
};

export type SketchObject = Interfaces.TypeFromSchema<typeof sketch_object_schema>;
export type AllSketchesRequest = Interfaces.TypeFromSchema<typeof all_sketches_request_schema>;
export type AllSketchesResponse = Interfaces.TypeFromSchema<typeof all_sketches_response_schema>;
