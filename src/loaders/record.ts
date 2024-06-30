import Config from "../config";

import * as Record from "../descriptors/record";
import * as Filesystem from "../filesystem";
import { pipeline } from "../pipeline";

export async function get(name: string, chapter: string): Promise<Record.Model> {
    const record_path = `${Config.authorland_root}/records/chapter-${chapter}/${name}.txt`;

    const record = parse_from(await Filesystem.read(record_path));

    return record;
}

export function parse_from(record_contents: string): Record.Model {
    // Only trim the end because some markdown shit like lists has significant whitespace at the start
    const lines = record_contents.split("\n").map(line => line.trimEnd());

    const {header, body} = get_parts(lines);
    const parsed_header = parse_header(header);
    const parsed_lines = parse_body(body);

    const characters = pipeline.start(parsed_lines)
        .then(lines => lines.map(line => line.character))
        .then(chars => chars.filter(x => x) as Array<string>)
        .then(chars => chars.toSorted())
        .then(chars => [...new Set(chars)])
        .done();

    const record = {...parsed_header, characters, lines: parsed_lines};
    record.lines = assign_missing_languages(record.lines, record.languages);
    record.languages = record_missing_languages(record.lines, record.languages);

    return record;
}

function get_parts(lines: Array<string>): {header: Array<string>, body: Array<string>} {
    // The header ends at the first blank line after the angle-bracket lines.
    const header_end_index = lines.findIndex((line, i, lines) => line.startsWith("<") && lines[i + 1] === "") + 1;

    const header = lines.slice(0, header_end_index);
    const body = lines.slice(header_end_index + 1);

    return {header, body};
}

function parse_options(options: string): Record.Model["options"] {
    const options_object = pipeline.start(options)
        .then(line => line.substring(2, line.length - 2))
        .then(line => line.split(","))
        .then(pairs => pairs.map(pair => pair.split("=")))
        .then(entries => Object.fromEntries(entries) as Record.Model["options"])
        .done();

    return options_object;
}

function parse_languages(header_lines: Array<string>): Array<string> {
    const language_def_regex = /iteration\[.+\]\..+\.(.+) ->/;
    const languages = pipeline.start(header_lines)
        .then(lines => lines.filter(line => line.match(language_def_regex)))
        .then(lines => lines.map(line => line.match(language_def_regex)![1]))
        .done();
    
    return languages;
}

function assign_missing_languages(lines: Array<Record.LineModel>, languages: Array<string>): Array<Record.LineModel> {
    const new_lines = lines.map((line, i) => {
        if (line.language || line.type === "Sabre") {
            return line;
        }

        const previous_line_with_language = lines.slice(0, i).findLast(line => line.language);
        const first_language_in_record = languages[0];

        return {...line,
            language: previous_line_with_language?.language ?? first_language_in_record,
        };
    });
    return new_lines;
}

function record_missing_languages(lines: Array<Record.LineModel>, languages: Array<string>): Array<string> {
    const languages_in_lines = lines.map(line => line.language?.toLowerCase()).filter(x => x) as Array<string>;
    const all_languages = [...new Set([...languages, ...languages_in_lines])];
    return all_languages;
}

function parse_header(lines: Array<string>): Pick<Record.Model, "requested" | "options" | "header_lines" | "languages"> {
    const requested = lines[1] === "Record ordered on behalf of the NSIrP";
    const options = parse_options(lines[0]);

    const header_lines = lines.filter(line => line.startsWith("<"));
    const languages = parse_languages(header_lines);

    return {requested, options, header_lines, languages};
}

function parse_body(lines: Array<string>): Array<Record.LineModel> {
    const parsed_lines: Array<Record.LineModel> = [];

    const sabre_line_regex = /^< *(.+) *>/;
    const label_regex = /^(\w.*?)(?:\(((?:in )?[\w\s]*?)\))? *(?:\(((?:in )?[\w\s]*?)\))? : *(.*)?/;

    let current_label: Omit<Record.LineModel, "text"> | undefined;
    let accumulated_text = "";

    const commit_line = () => { 
        if (current_label && accumulated_text.length > 0) {
            parsed_lines.push({...current_label, text: accumulated_text});
        }
    }

    for (const line of lines) {
        if (line === "...") {
            commit_line();
            parsed_lines.push({type: "Sabre", text: line});
            current_label = undefined;
        }

        const sabre_line_match = line.match(sabre_line_regex);
        if (sabre_line_match) {
            commit_line();
            parsed_lines.push({type: "Sabre", text: sabre_line_match[1]});
            current_label = undefined;
        }

        const label_match = line.match(label_regex);
        if (label_match) {
            const [, character, modifier_1, modifier_2, inline_text] = label_match;

            const language = [modifier_1, modifier_2].find(modifier => modifier?.startsWith("in"))?.substring(3);
            const emphasis = [modifier_1, modifier_2].find(modifier => modifier && !modifier.startsWith("in"));
            const is_inline = !!inline_text;

            commit_line();

            current_label = {
                type: is_inline ? "Inline" : "Block", 
                character: character === "_" ? Record.narrator_character : character.trim(), 
                language, 
                emphasis
            };

            accumulated_text = inline_text ?? "";
        }

        // A blank line means a new block line
        if (line.length === 0 && current_label?.type === "Block") {
            commit_line();
            accumulated_text = "";
        }

        if (line.length > 0 && !label_match) {
            // Line breaks must be preserved...
            // The record texts get sent through a markdown processor on the client side
            // so it doesn't really matter, but records with fmt=poem treat line breaks 
            // as significant so we need them
            accumulated_text += `${line}\n`; 
        }
    }

    commit_line();
        
    return parsed_lines;
}