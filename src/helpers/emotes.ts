export type EmoteParsedTextChunk =
    | {type: "text", text: string}
    | {type: "known-emote", name: string}
    | {type: "unknown-emote", name: string}

export const known_emote_names = [
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
    "lkapprove",
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
    "vxtongue",
    "vxwave",
    "vxwoah",
    "r1",
    "r2",
    "r3",
    "r4",
    "r5",
    "r6",
    "r7",
    "r8",
    "r9",
    "r10",
    "r11",
    "r12",
    "r13",
    "r14",
    "r15",
    "r16",
    "r17",
    "r18",
    "r19",
    "r20"
];

export function parse_discord_emotes(input: string): Array<EmoteParsedTextChunk> {
    const matches = [...input.matchAll(/<:(\w+):(\d+)>/g)];

    let chunks: Array<EmoteParsedTextChunk> = [];

    let input_cursor = 0;
    for (let i = 0; i < matches.length; i++) {
        const match = matches[i];
        const emote_name = match[1];

        const substring_start = input_cursor;
        const substring_end = match.index;

        const leading_text = input.substring(substring_start, substring_end);

        chunks.push({type: "text", text: leading_text});

        if (known_emote_names.includes(emote_name)) {
            chunks.push({type: "known-emote", name: emote_name});
        }
        else {
            chunks.push({type: "unknown-emote", name: emote_name});
        }

        input_cursor = match.index + match[0].length;
    }

    chunks.push({type: "text", text: input.substring(input_cursor)});
    chunks = chunks.filter(c => !(c.type === "text" && c.text.length === 0));

    return chunks;
}

export function collapsed_length(chunks: Array<EmoteParsedTextChunk>): number {
    const known_emote_collapsed_length = 2;

    const length = chunks
        .map(c => c.type === "text"
            ? c.text.length
            : c.type === "known-emote"
            ? known_emote_collapsed_length
            : c.name.length
        )
        .reduce((a, b) => a + b, 0);

    return length;

}
