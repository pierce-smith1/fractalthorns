import * as Interfaces from "../../interfaces";
import * as PublicImage from "./image";
import * as PublicEpisodic from "./episodic";

export const domain_search_result = {
    type: {
        type: Interfaces.fields.required_string,
        description: "The type of the search that this result originated from: either `image`, `episodic-item`, or `episodic-line`.",
    },
    image: {
        type: Interfaces.fields.optional_object(PublicImage.image_response),
        description: "If this was an `image` search, the image that was found.",
    },
    record: {
        type: Interfaces.fields.optional_object(PublicEpisodic.redactable_record_entry),
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
};
export type DomainSearchResult = Interfaces.ModelFromInterface<typeof domain_search_result>;

export const domain_search_request = {
    term: {
        type: Interfaces.fields.required_string,
        description: "The string to search for. What will be searched and how depends on the `type` field of this object.",
    },
    type: {
        type: Interfaces.fields.required_string,
        description: "Must be one of `image`, `episodic-item`, or `episodic-line`. If `images`, the term will be searched against the titles of images using a simple case-insensitive contains() check. If `episodic-item`, the term will be searched against the titles of records using a simple case-insensitive contains() check. If `episodic-line`, the term will be interpreted as a case-insensitive regex and searched against the text of all solved records."
    },
};
export type DomainSearchRequest = Interfaces.ModelFromInterface<typeof domain_search_request>;