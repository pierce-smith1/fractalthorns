export type EmoteParsedTextChunk =
    | {type: "text", text: string}
    | {type: "emote", name: string}

export const valid_emote_names = [
    "cv",
    "cvdisgust",
    "cvevil",
    "cvflush",
    "cvheadache",
    "cvheart",
    "cvhuh",
    "cvjoy",
    "cvscream",
    "cvtired",
    "fn",
    "fndizzy",
    "fnplead",
    "lk",
    "lkcold",
    "lkconcern",
    "lkcool",
    "lkexhausted",
    "lkhusk",
    "lkjoy",
    "lklown",
    "lkmoyai",
    "lksix",
    "lkthink",
    "lkthumbsup",
    "lkunamused",
    "lkxd",
    "nx",
    "nxcry",
    "nxeye",
    "nxlazy",
    "nxmath",
    "nxnerd",
    "nxrage",
    "os",
    "vx",
    "vxhusk",
    "vxorange",
    "vxtounge",
    "vxwave",
    "vxwoah"
];

export function parse_discord_emotes(input: string): Array<EmoteParsedTextChunk> {
    const matches = [...input.matchAll(/<:(\w+):(\d+)>/g)];

    let chunks: Array<EmoteParsedTextChunk> = [];

    let input_cursor = 0;
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const emote_name = match[1];

        if (!valid_emote_names.includes(emote_name)) {
            continue;
        }

        const substring_start = input_cursor;
        const substring_end = match.index;

        const leading_text = input.substring(substring_start, substring_end);

        chunks.push({type: "text", text: leading_text});
        chunks.push({type: "emote", name: emote_name});

        input_cursor = match.index + match[0].length;
    }

    chunks.push({type: "text", text: input.substring(input_cursor)});
    chunks = chunks.filter(c => !(c.type === "text" && c.text.length === 0));

    return chunks;
}

export function collapsed_length(chunks: Array<EmoteParsedTextChunk>): number {
    const emote_collapsed_length = 1;
    const length = chunks
        .map(c => c.type === "text" ? c.text.length : emote_collapsed_length)
        .reduce((a, b) => a + b, 0);

    return length;

}
