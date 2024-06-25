import * as Episodic from "./descriptors/episodic";
import * as Record from "./descriptors/record";

const fields = {
    optional_boolean: "optional_boolean",
    required_boolean: "required_boolean",
    optional_number: "optional_number",
    required_number: "required_number",
    optional_string: "optional_string",
    required_string: "required_string",
    optional_array: <T>(field_type: T) => ["optional_array", field_type] as const,
    required_array: <T>(field_type: T) => ["required_array", field_type] as const,
    optional_object: <T>(field_type: T) => ["optional_object", field_type] as const,
    required_object: <T>(field_type: T) => ["required_object", field_type] as const,
} as const;

type FieldType<F> = 
F extends readonly [infer M, infer T] ? 
    M extends "optional_array"
        ? Array<FieldType<T>> | undefined : 
    M extends "required_array"
        ? Array<FieldType<T>> :
    M extends "optional_object"
        ? T extends {[key: string]: {type: any}} ? {[key in keyof T]: FieldType<T[key]["type"]> } | undefined : undefined :
    M extends "required_object"
        ? T extends {[key: string]: {type: any}} ? {[key in keyof T]: FieldType<T[key]["type"]> } : undefined :
    undefined :
F extends "optional_boolean" 
    ? boolean | undefined :
F extends "required_boolean"
    ? boolean :
F extends "optional_number" 
    ? number | undefined :
F extends "required_number"
    ? number :
F extends "optional_string"
    ? string | undefined :
F extends "required_string"
    ? string :
Record<string, never>;

type ModelFromInterface<D extends {[key: string]: {type: any}}> = {[key in keyof D]: FieldType<D[key]["type"]>};

const all_news_endpoint = {
    request: {},
    response: {
        name: {
            type: fields.required_string,
            description: "Some witty quip to use as the name of the update",
        },
        items: {
            type: fields.required_array(fields.required_string),
            description: "A list of changes made in this update",
        },
        date: {
            type: fields.required_string,
            description: "The date the update was made in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ)",
        },
        version: {
            type: fields.optional_string,
            description: "If this update should change the version string, the new version string - not present otherwise",
        },
    },
} as const;

const single_image_endpoint = {
    request: {
        name: {
            type: fields.optional_string,
            description: "The name of the image to get info for. Defaults to the name of the latest image.",
        },
    },
    response: {
        name: {
            type: fields.required_string,
            description: "The identifying name of the image, i.e. the one found in URLs",
        },
        title: {
            type: fields.required_string,
            description: "The display title of the image",
        },
        date: {
            type: fields.required_string,
            description: "The date the image was made in ISO 8601 YYYY-MM-DD format",
        },
        ordinal: {
            type: fields.required_number,
            description: "The 1-based index of the image from oldest to newest, i.e. the \"#n\" displayed on the site",
        },
        image_url: {
            type: fields.required_string,
            description: "The URL the image data can be requested from",
        },
        thumb_url: {
            type: fields.required_string,
            description: "The URL the image's thumbnail data can be requested from",
        },
        canon: {
            type: fields.optional_string,
            description: `If applicable, the iteration the image depicts. Will be one of (${Episodic.iterations.join(", ")})`,
        },
        characters: {
            type: fields.required_array(fields.required_string),
            description: "A list of characters depicted in this image, including non-canon variants of those characters. May be empty.",
        },
        description: {
            type: fields.optional_string,
            description: "The description of the image, in Markdown format.",
        },
        speedpaint_video_url: {
            type: fields.optional_string,
            description: "If it exists, the URL of the speedpaint for the image.",
        }
    }
} as const;

const all_images_endpoint = {
    request: {},
    response: {
        images: {
            type: fields.required_array(fields.required_object(single_image_endpoint.response)),
            description: "An array of every image, sorted newest to oldest"
        }
    }
};

const redactable_record_entry = {
    chapter: {
        type: fields.required_string,
        description: "The chapter of this record",
    },
    name: {
        type: fields.optional_string,
        description: "The identifying name of this record, i.e. the one found in URLs. Not present if the record is unsolved. Use this name to query for the text of the record via the `record_text` endpoint"
    },
    title: {
        type: fields.optional_string,
        description: "The display title of this record. Not present if the record is unsolved",
    },
    solved: {
        type: fields.required_boolean,
        description: "Whether or not this record has been solved (will be true for everything except right after new chapters come out)",
    },
    iteration: {
        type: fields.optional_string,
        description: `The iteration this record takes place in. Not present if the record is unsolved. Will be one of (${Episodic.iterations.join(", ")})`,
    },
};

const chapter_entry = {
    name: {
        type: fields.required_string,
        description: "The name of this chapter",
    },
    records: {
        type: fields.required_array(fields.required_object(redactable_record_entry)),
        description: "The records in this chapter",
    },
};

const full_episodic_endpoint = {
    request: {},
    response: {
        chapters: {
            type: fields.required_array(fields.required_object(chapter_entry)),
            description: "A list of the chapters currently in the story, ordered by release time",
        },
    },
};

const single_record_endpoint = {
    request: {
        name: {
            type: fields.required_string,
            description: "The name of the record to get info for. Use names gathered from the `name` field of the entries provided by `full_episodic`",
        },
    },
    response: redactable_record_entry,
};

const line_model = {
    type: {
        type: fields.required_string,
        description: "Reserved for private use"
    },
    character: {
        type: fields.optional_string,
        description: "The character who says this line. Will be \"Narrator\" if the line is not attributed to a character, such as for generic narration. May be omitted if the character is undetermined or ambiguous",
    },
    language: {
        type: fields.optional_string,
        description: "The language this line was originally said in. May be empty if the langauge is undetermined or ambiguous",
    },
    emphasis: {
        type: fields.optional_string,
        description: "If present, the emphasis given to the line, e.g. (angrily), (while looking away)",
    },
    text: {
        type: fields.required_string,
        description: "The text of the line in Markdown format. Beware, line breaks and other whitespace may be present in it",
    },
};

const record_text_endpoint = {
    request: single_record_endpoint.request,
    response: {
        requested: {
            type: fields.required_boolean,
            description: "Reserved for private use",
        },
        iteration: {
            type: fields.required_string,
            description: `The iteration this record takes place in. Will be one of (${Episodic.iterations.join(", ")})`,
        },
        format: {
            type: fields.optional_string,
            description: "Reserved for private use"
        },
        header_lines: {
            type: fields.required_array(fields.required_string),
            description: "A list of all the lines making up the header, i.e. the lines at the beginning of the record starting with < and ending with >",
        },
        languages: {
            type: fields.required_array(fields.required_string),
            description: "A list of the languages used in this record, in no particular order",
        },
        characters: {
            type: fields.required_array(fields.required_string),
            description: "A list of all the characters that have lines in this record, in no particular order",
        },
        lines: {
            type: fields.required_array(fields.required_object(line_model)),
            description: "A list of all the lines in this record, ordered first to last. A \"line\" is simply an arbitrary, contiguous chunk of text attributed to a character and could contain line breaks" 
        },
    },
};

const domain_search_result_item = {
    type: {
        type: fields.required_string,
        description: "The type of the search that this result originated from: either `images`, `episodic-item`, or `episodic-line`",
    },
    image: {
        type: fields.optional_object(single_image_endpoint.response),
        description: "If this was an `images` search, the image that was found",
    },
    record: {
        type: fields.optional_object(single_record_endpoint.response),
        description: "If this was an `episodic-item` or `episodic-line` search, the record that was found",
    },
    record_matched_text: {
        type: fields.optional_string,
        description: "If this was an `episodic-line` search, the text that was matched",
    },
    record_line_index: {
        type: fields.optional_number,
        description: "If this was an `episodic-line` search, the index of the line that was matched",
    },
};

const domain_search_endpoint = {
    request: {
        term: {
            type: fields.required_string,
            description: "The string to search for. What will be searched and how depends on the `type` field of this object",
        },
        type: {
            type: fields.required_string,
            description: "Must be one of `images`, `episodic-item`, or `episodic-line`. If `images`, the term will be searched against the titles of images. If `episodic-item`, the term will be searched against the titles of records. If `episodic-line`, the term will be searched against the text of all solved records"
        },
    },
    response: {
        items: {
            type: fields.required_array(fields.required_object(domain_search_result_item)),
            description: "An array of the results the search found, in no particular order",
        },
    },
};

export const endpoints = {
    all_news: all_news_endpoint,
    single_image: single_image_endpoint,
    all_images: all_images_endpoint,
    full_episodic: full_episodic_endpoint,
    single_record: single_record_endpoint,
    record_text: record_text_endpoint,
    domain_search: domain_search_endpoint,
} as const;

export type GetEndpoints = {[endpoint in keyof typeof endpoints]: {
    request: ModelFromInterface<typeof endpoints[endpoint]["request"]>,
    response: ModelFromInterface<typeof endpoints[endpoint]["response"]>,
}};

let x = {} as GetEndpoints;
