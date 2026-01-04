import * as Interfaces from "../interfaces"

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
        type: Interfaces.fields.required_string,
        description: "The identifying name of this record, i.e. the one found in URLs. Use this name to query for the text of the record via the `record_text` endpoint."
    },
    title: {
        type: Interfaces.fields.optional_string,
        description: "The display title of this record.",
    },
    iteration: {
        type: Interfaces.fields.optional_string,
        description: "The iteration this record takes place in. Not present if the record is unsolved.",
    },
    linked_puzzles: {
        type: Interfaces.fields.optional_array(Interfaces.fields.required_string),
        description: "A list of the names of puzzles that are explicitly linked to this record and will unlock it once they are solved. Not present when there are no such puzzles. Note that other puzzles not in this list may still unlock this record - this list only includes puzzles that explicitly have `linked` solve behavior, but other solve behaviors may also indirectly lead to this record being unlocked.",
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

export const full_episodic_request_schema = {} as const;

export const full_episodic_response_schema = {
    chapters: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(chapter_entry_schema)),
        description: "A list of the chapters currently in the story, ordered by release time.",
    },
} as const;

export const full_episodic_endpoint = {
    description: "Get metadata about the story.",
    request: full_episodic_request_schema,
    response: full_episodic_response_schema,
} as const;

export const single_record_request_schema = {
    name: {
        type: Interfaces.fields.optional_string,
        description: "The name of the record to get info for. Use names gathered from the `name` field of the entries provided by `full_episodic`. Defaults to the name of the first record in the story.",
    },
} as const;

export const single_record_endpoint = {
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

export const record_text_endpoint = {
    description: "Get the parsed contents of a single record. You will receive a 400 and a meaningless response if the record is not solved.",
    request: single_record_request_schema,
    response: record_text_response_schema,
} as const;

export type RedactableRecordEntry = Interfaces.TypeFromSchema<typeof redactable_record_entry_schema>;
export type ChapterEntry = Interfaces.TypeFromSchema<typeof chapter_entry_schema>;
export type FullEpisodicRequest = Interfaces.TypeFromSchema<typeof full_episodic_request_schema>;
export type RecordLine = Interfaces.TypeFromSchema<typeof line_object_schema>;
export type RecordTextResponse = Interfaces.TypeFromSchema<typeof record_text_response_schema>;
