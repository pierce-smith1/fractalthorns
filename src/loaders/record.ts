import Config from "../config";

import * as Episodic from "../descriptors/episodic";
import * as Record from "../descriptors/record";
import * as Filesystem from "../filesystem";
import * as GenericUtil from "../genericutil";

export async function get(name: string, chapter: string): Promise<Record.Model> {
    const record_path = `${Config.authorland_root}/records/chapter-${chapter}/${name}.txt`;

    const record_file_contents = await Filesystem.read(record_path);

    const record = parse_from(record_file_contents);

    return record;
}

export function parse_from(record_contents: string): Record.Model {
    const record: Record.Model = { 
        requested: false,
        options: {},
        header_lines: [],
        languages: [],
        characters: [],
        lines: [],
    };

    type ParserState = 
        | "ExpectingOptions"
        | "ExpectingRequested"
        | "ExpectingHeader"
        | "InHeader"
        | "InDocument"
    let state: ParserState = "ExpectingOptions";

    let lines = record_contents.split("\n");
    lines = lines.map(line => line.replaceAll("\r", ""));

    let last_line: Record.LineModel | undefined = undefined;
    for (const line of lines) {
        switch (state) {
            case "ExpectingOptions": {
                const raw_options = line.substring(2, line.length - 2);
                const options_pairs = raw_options.split(",");
                const options = options_pairs.map(pair => pair.split("="));
                const options_object = Object.fromEntries(options);

                record.options = options_object;
                state = "ExpectingRequested";
                break;
            } case "ExpectingRequested": {
                record.requested = line === "Record ordered on behalf of the NSIrP";
                state = "ExpectingHeader";
                break;
            } case "ExpectingHeader": {
                if (line.startsWith("<")) {
                    record.header_lines.push(line);
                    state = "InHeader";
                }
                break;
            } case "InHeader": {
                const language_match = line.match(/iteration\[.+\]\..+\.(.+).+->/);
                if (language_match) {
                    record.languages.push(language_match[1].toUpperCase());
                }

                if (line.trim() === "") {
                    state = "InDocument";
                    break;
                }

                record.header_lines.push(line);
                break;
            } case "InDocument": {
                const last_line_was_block = last_line?.type === "Block";
                if (last_line && line.trim() === "" && last_line_was_block && last_line?.text.trim() !== "") {
                    record.lines.push(last_line);
                    // @ts-ignore TODO what the fuck is wrong with TS here??????
                    last_line = {...last_line, text: ""}; 
                }

                const line_start_match = line.trim().match(/(.+?) (\(.+?\) )?(\(.+?\) )?:( .+)?$/);
                if (line_start_match) {
                    if (last_line && last_line.text.trim() !== "") {
                        record.lines.push(last_line);
                    }

                    let [_, character, modifier_1, modifier_2, content] = line_start_match;
                    if (character === "_") {
                        character = Record.narrator_character;
                    }

                    last_line = {
                        type: content ? "Inline" : "Block",
                        character: character,
                        language: (last_line?.language ?? record.languages[0]).toUpperCase(),
                        text: content?.trim() ?? "",
                    };

                    if (modifier_1 && modifier_1.startsWith("(in ")) {
                        last_line.language ??= modifier_1.substring(3).toUpperCase();
                    } else {
                        last_line.emphasis ??= modifier_1;
                    }

                    if (modifier_2 && modifier_2.startsWith("(in ")) {
                        last_line.language ??= modifier_2.substring(3).toUpperCase();
                    } else {
                        last_line.emphasis ??= modifier_2;
                    }

                    break;
                }

                if (line.trim().startsWith("< ") && line.trim().endsWith(" >")) {
                    if (last_line) {
                        record.lines.push(last_line);
                    }
                    record.lines.push({type: "Sabre", text: line.substring(2, line.length - 2)});
                    break;
                }

                if (last_line) {
                    last_line.text += `${line}\n`;
                }
            }
        }
    }

    record.lines = record.lines.map(line => ({...line, text: line.text.trim()}));

    let all_characters = record.lines.map(line => line.character);
    all_characters = all_characters.sort();
    all_characters = GenericUtil.unique(all_characters);
    all_characters = all_characters.filter(lang => lang);
    record.characters = all_characters as Array<string>;

    let all_languages = record.lines.map(line => line.language);
    all_languages = all_languages.concat(record.languages);
    all_languages = all_languages.sort();
    all_languages = GenericUtil.unique(all_languages);
    all_languages = all_languages.filter(lang => lang);
    record.languages = all_languages as Array<string>;

    return record;
}
