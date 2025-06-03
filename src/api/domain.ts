import * as Interfaces from "../interfaces";
import * as ImageApi from "./images";
import * as SketchApi from "./sketches";
import * as EpisodicApi from "./episodic";

export const domain_search_request_schema = {
    term: {
        type: Interfaces.fields.required_string,
        description: "The string to search for. What will be searched and how depends on the `type` field of this object.",
    },
    type: {
        type: Interfaces.fields.required_string,
        description: "Must be one of `image`, `sketch`, `episodic-item`, or `episodic-line`. If `image` or `sketch`, the term will be searched against the titles of images using a simple case-insensitive contains() check. If `episodic-item`, the term will be searched against the titles of records using a simple case-insensitive contains() check. If `episodic-line`, the term will be interpreted as a case-insensitive regex and searched against the text of all solved records."
    },
} as const;

export const domain_search_result_schema = {
    type: {
        type: Interfaces.fields.required_string,
        description: "The type of the search that this result originated from: either `image`, `sketch`, `episodic-item`, or `episodic-line`.",
    },
    image: {
        type: Interfaces.fields.optional_object(ImageApi.image_object_schema),
        description: "If this was an `image` search, the image that was found.",
    },
    sketch: {
        type: Interfaces.fields.optional_object(SketchApi.sketch_object_schema),
        description: "If this was a `sketch` search, the sketch that was found.",
    },
    record: {
        type: Interfaces.fields.optional_object(EpisodicApi.redactable_record_entry_schema),
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

export const domain_search_endpoint = {
    description: "Perform a search over images or records.",
    request: domain_search_request_schema,
    response: domain_search_response_schema,
} as const;

export type DomainSearchRequest = Interfaces.TypeFromSchema<typeof domain_search_request_schema>;
export type DomainSearchResult = Interfaces.TypeFromSchema<typeof domain_search_result_schema>;
