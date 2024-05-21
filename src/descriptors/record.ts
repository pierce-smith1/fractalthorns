export type LineModel = {
    type: "Block" | "Inline" | "Sabre",
    character?: string,
    language?: string,
    emphasis?: string,
    text: string,
};

type Options = {[key: string]: string};
export type Model = {
    requested: boolean,
    options: Options,
    header_lines: Array<string>,
    languages: Array<string>,
    characters: Array<string>,
    lines: Array<LineModel>,
};

export const narrator_character = "Narrator" as const;

export type RecordTextRequest = {
    name: string,
};
