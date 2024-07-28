import * as Interfaces from "./interfaces";

// news

export const news_item_schema = {
    title: {
        type: Interfaces.fields.required_string,
        description: "Some witty quip to use as the name of the update.",
    },
    items: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of changes made in this update.",
    },
    date: {
        type: Interfaces.fields.required_string,
        description: "The date the update was made in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).",
    },
    version: {
        type: Interfaces.fields.optional_string,
        description: "If this update should change the version string, the new version string to use - not present otherwise.",
    },
} as const;

export const all_news_request_schema = {

} as const;

export const all_news_response_schema = {
    items: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(news_item_schema)),
        description: "A list of the news items, ordered from newest to oldest.",
    }
} as const;

const all_news_endpoint = {
    description: "Get the news items that show up on the front page. These are usually but not always site updates.",
    request: all_news_request_schema,
    response: all_news_response_schema,
} as const;

export type NewsItem = Interfaces.TypeFromSchema<typeof news_item_schema>;
export type AllNewsRequest = Interfaces.TypeFromSchema<typeof all_news_request_schema>;
export type AllNewsResponse = Interfaces.TypeFromSchema<typeof all_news_response_schema>;

// images

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
        description: "True if and only if the image has a description, i.e. a call to `image_description` will return a non-empty `description` field."
    },
    characters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of characters depicted in this image, including non-canon variants of those characters. May be empty.",
    },
    speedpaint_video_url: {
        type: Interfaces.fields.optional_string,
        description: "If it exists, the URL of the speedpaint for the image.",
    },
    primary_color: {
        type: Interfaces.fields.optional_string,
        description: "An approximation of the most dominant color in the image, in #RRGGBB format. The calculation does not take into account low-saturation colors, so this may be omitted if there are no sufficiently saturated colors in the image."
    },
    secondary_color: {
        type: Interfaces.fields.optional_string,
        description: "An approximation of the second most dominant color in the image, in #RRGGBB format. The calculation does not take into account low-saturation colors, so this may be omitted if there are no sufficiently saturated colors in the image."
    },
};

export const single_image_request_schema = {
    name: {
        type: Interfaces.fields.optional_string,
        description: "The name of the image to get info for. Defaults to the name of the latest image.",
    },
} as const;

const single_image_endpoint = {
    description: "Get metadata for a single image.",
    request: single_image_request_schema,
    response: image_object_schema,
} as const;

export const all_images_request_schema = {

} as const;

export const all_images_response_schema = {
    images: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(image_object_schema)),
        description: "A list of every image, sorted newest to oldest.",
    },
} as const;

const all_images_endpoint = {
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

const image_description_endpoint = {
    description: "Get the description for an image.",
    request: named_image_request_schema,
    response: image_description_response_schema,
} as const;

export type ImageObject = Interfaces.TypeFromSchema<typeof image_object_schema>;
export type SingleImageRequest = Interfaces.TypeFromSchema<typeof single_image_request_schema>;
export type NamedImageRequest = Interfaces.TypeFromSchema<typeof named_image_request_schema>;
export type AllImagesRequest = Interfaces.TypeFromSchema<typeof all_images_request_schema>;

// episodic

export const redactable_record_entry_schema = {
    solved: {
        type: Interfaces.fields.required_boolean,
        description: "Whether or not this record has been solved (will be true for everything except right after new chapters come out).",
    },
    chapter: {
        type: Interfaces.fields.required_string,
        description: "The chapter of this record.",
    },
    name: {
        type: Interfaces.fields.optional_string,
        description: "The identifying name of this record, i.e. the one found in URLs. Not present if the record is unsolved. Use this name to query for the text of the record via the `record_text` endpoint."
    },
    title: {
        type: Interfaces.fields.optional_string,
        description: "The display title of this record. Not present if the record is unsolved.",
    },
    iteration: {
        type: Interfaces.fields.optional_string,
        description: `The iteration this record takes place in. Not present if the record is unsolved.`,
    },
} as const;

export const chapter_entry_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of this chapter.",
    },
    records: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(redactable_record_entry_schema)),
        description: "The records in this chapter.",
    },
} as const;

export const full_episodic_request_schema = {

} as const;

export const full_episodic_response_schema = {
    chapters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(chapter_entry_schema)),
        description: "A list of the chapters currently in the story, ordered by release time.",
    },
} as const;

const full_episodic_endpoint = {
    description: "Get metadata about the story.",
    request: full_episodic_request_schema,
    response: full_episodic_response_schema,
} as const;

export const single_record_request_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The name of the record to get info for. Use names gathered from the `name` field of the entries provided by `full_episodic`.",
    },
} as const;

const single_record_endpoint = {
    description: "Get metadata about a single record.",
    request: single_record_request_schema,
    response: redactable_record_entry_schema,
} as const;

export const line_object_schema = {
    type: {
        type: Interfaces.fields.required_string,
        description: "Reserved for private use."
    },
    character: {
        type: Interfaces.fields.optional_string,
        description: "The character who says this line. Will be \"Narrator\" if the line is not attributed to a character, such as for generic narration. May be omitted if the character is undetermined or ambiguous. Not necesarily in uppercase or any particular casing.",
    },
    language: {
        type: Interfaces.fields.optional_string,
        description: "The language this line was originally said in. May be empty if the langauge is undetermined or ambiguous. Not necessarily in uppercase or any particular casing.",
    },
    emphasis: {
        type: Interfaces.fields.optional_string,
        description: "If present, the emphasis given to the line, e.g. (angrily), (while looking away).",
    },
    text: {
        type: Interfaces.fields.required_string,
        description: "The text of the line in Markdown format.",
    },
} as const;

export const record_text_response_schema = {
    requested: {
        type: Interfaces.fields.required_boolean,
        description: "Reserved for private use.",
    },
    iteration: {
        type: Interfaces.fields.required_string,
        description: `The iteration this record takes place in.`,
    },
    format: {
        type: Interfaces.fields.optional_string,
        description: "Reserved for private use."
    },
    header_lines: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of all the lines making up the header, i.e. the lines at the beginning of the record starting with < and ending with >.",
    },
    languages: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of the languages used in this record, in no particular order.",
    },
    characters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of all the characters that have lines in this record, in no particular order.",
    },
    lines: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(line_object_schema)),
        description: "A list of all the lines in this record, ordered first to last. A \"line\" is simply an arbitrary, contiguous chunk of text attributed to a character, and does not consider the presence of line breaks in the text." 
    },
} as const;

const record_text_endpoint = {
    description: "Get the parsed contents of a single record.",
    request: single_record_request_schema,
    response: record_text_response_schema,
} as const;

export type RedactableRecordEntry = Interfaces.TypeFromSchema<typeof redactable_record_entry_schema>;
export type ChapterEntry = Interfaces.TypeFromSchema<typeof chapter_entry_schema>;
export type FullEpisodicRequest = Interfaces.TypeFromSchema<typeof full_episodic_request_schema>;
export type RecordLine = Interfaces.TypeFromSchema<typeof line_object_schema>;
export type RecordTextResponse = Interfaces.TypeFromSchema<typeof record_text_response_schema>;

// domain

export const domain_search_request_schema = {
    term: {
        type: Interfaces.fields.required_string,
        description: "The string to search for. What will be searched and how depends on the `type` field of this object.",
    },
    type: {
        type: Interfaces.fields.required_string,
        description: "Must be one of `image`, `episodic-item`, or `episodic-line`. If `image`, the term will be searched against the titles of images using a simple case-insensitive contains() check. If `episodic-item`, the term will be searched against the titles of records using a simple case-insensitive contains() check. If `episodic-line`, the term will be interpreted as a case-insensitive regex and searched against the text of all solved records."
    },
} as const;

export const domain_search_result_schema = {
    type: {
        type: Interfaces.fields.required_string,
        description: "The type of the search that this result originated from: either `image`, `episodic-item`, or `episodic-line`.",
    },
    image: {
        type: Interfaces.fields.optional_object(image_object_schema),
        description: "If this was an `image` search, the image that was found.",
    },
    record: {
        type: Interfaces.fields.optional_object(redactable_record_entry_schema),
        description: "If this was an `episodic-item` or `episodic-line` search, the record that was found.",
    },
    record_matched_text: {
        type: Interfaces.fields.optional_string,
        description: "If this was an `episodic-line` search, the text that was matched.",
    },
    record_line_index: {
        type: Interfaces.fields.optional_number,
        description: "If this was an `episodic-line` search, the index of the line that was matched.",
    },
} as const;

export const domain_search_response_schema = {
    results: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(domain_search_result_schema)),
        description: "A list of the results the search found, in no particular order.",
    },
} as const;

const domain_search_endpoint = {
    description: "Perform a search over images or records.",
    request: domain_search_request_schema,
    response: domain_search_response_schema,
} as const;

export type DomainSearchRequest = Interfaces.TypeFromSchema<typeof domain_search_request_schema>;
export type DomainSearchResult = Interfaces.TypeFromSchema<typeof domain_search_result_schema>;

export const endpoints = {
    all_news: all_news_endpoint,
    single_image: single_image_endpoint,
    image_description: image_description_endpoint,
    all_images: all_images_endpoint,
    full_episodic: full_episodic_endpoint,
    single_record: single_record_endpoint,
    record_text: record_text_endpoint,
    domain_search: domain_search_endpoint,
} as const;

export type GetEndpoints = {[endpoint in keyof typeof endpoints]: {
    request: Interfaces.TypeFromSchema<typeof endpoints[endpoint]["request"]>,
    response: Interfaces.TypeFromSchema<typeof endpoints[endpoint]["response"]>,
}};
