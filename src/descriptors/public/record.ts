import * as Interfaces from "../../interfaces";

export const line_model = {
    type: {
        type: Interfaces.fields.required_string,
        description: "Reserved for private use."
    },
    character: {
        type: Interfaces.fields.optional_string,
        description: "The character who says this line. Will be \"Narrator\" if the line is not attributed to a character, such as for generic narration. May be omitted if the character is undetermined or ambiguous.",
    },
    language: {
        type: Interfaces.fields.optional_string,
        description: "The language this line was originally said in. May be empty if the langauge is undetermined or ambiguous.",
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
export type LineModel = Interfaces.ModelFromInterface<typeof line_model>;

export const record_text_response = {
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
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(line_model)),
        description: "A list of all the lines in this record, ordered first to last. A \"line\" is simply an arbitrary, contiguous chunk of text attributed to a character, and does not consider the presence of line breaks in the text." 
    },
} as const;
export type RecordTextResponse = Interfaces.ModelFromInterface<typeof record_text_response>;

export const narrator_character = "Narrator" as const;