import Config from "../config";

import * as Store from "./_store";
import * as Filesystem from "../filesystem";
import * as RecordHelpers from "../helpers/record";

export type Line = {
    type: "Block" | "Inline" | "Sabre",
    character?: string,
    language?: string,
    emphasis?: string,
    text: string,
};

export type RecordBase = {
    requested: boolean,
    options: {[key: string]: string},
    header_lines: Array<string>,
    languages: Array<string>,
    characters: Array<string>,
    lines: Array<Line>,
};

export type IdentifiableRecord = RecordBase & {
    name: string,
    chapter: string,
};

export type Record = IdentifiableRecord & {
    solved: boolean,
    iteration: string,
    title: string,
};

export class RecordStore extends Store.Store<Record> {
    async load() {
        const story_file_path = `${Config.authorland_root}/records/story.json`;
        const story_file_contents = await Filesystem.read(story_file_path);
        const story_definition = JSON.parse(story_file_contents) as Array<{chapter_name: string, records: Array<[string, string]>}>;

        const solved_records_file_path = `${Config.readerland_root}/story/solved.json`;
        const solved_records_content = await Filesystem.read(solved_records_file_path);
        const solved_titles = JSON.parse(solved_records_content) as Array<string>; 

        const records = await Promise.all(story_definition.flatMap(chapter => chapter.records.map(async ([iteration, title]) => {
            const name = title.replaceAll(" ", "-");
            const record = await this.load_one(name, chapter.chapter_name);
            return {...record,
                solved: solved_titles.includes(title),
                iteration,
                title,
            };
        })));

        return records;
    }

    async load_one(name: string, chapter: string): Promise<IdentifiableRecord> {
        const record_path = `${Config.authorland_root}/records/chapter-${chapter}/${name}.txt`;

        const record = this.parse_from(await Filesystem.read(record_path));

        return {...record, 
            name, 
            chapter,
        };
    }

    parse_from(record_contents: string): RecordBase {
        // Only trim the end because some markdown shit like lists has significant whitespace at the start
        const lines = record_contents.split("\n").map(line => line.trimEnd());

        const {header, body} = this.get_parts(lines);
        const parsed_header = this.parse_header(header);
        const parsed_lines = this.parse_body(body);

        const characters = (() => {
            const chars = parsed_lines
                .map(line => line.character)
                .filter(x => x) as Array<string>;
            
            const sorted = chars.toSorted();
            const unique = [...new Set(sorted)];

            return unique;
        })();
        
        const record = {...parsed_header, characters, lines: parsed_lines};
        record.lines = this.assign_missing_languages(record.lines, record.languages);
        record.languages = this.record_missing_languages(record.lines, record.languages);

        return record;
    }
    
    get_parts(lines: Array<string>): {header: Array<string>, body: Array<string>} {
        // The header ends at the first blank line after the angle-bracket lines.
        const header_end_index = lines.findIndex((line, i, lines) => line.startsWith("<") && lines[i + 1] === "") + 1;

        const header = lines.slice(0, header_end_index);
        const body = lines.slice(header_end_index + 1);

        return {header, body};
    }

    parse_options(options: string): RecordBase["options"] {
        const pairs_list = options.substring(2, options.length - 2);
        const pairs = pairs_list.split(",");
        const entries = pairs.map(pair => pair.split("="));
        const object = Object.fromEntries(entries) as RecordBase["options"];

        return object;
    }

    parse_languages(header_lines: Array<string>): Array<string> {
        const language_def_regex = /iteration\[.+\]\..+\.(.+) ->/;
        const language_lines = header_lines.filter(line => line.match(language_def_regex));
        const languages = language_lines.map(line => line.match(language_def_regex)![1]);
        
        return languages;
    }

    assign_missing_languages(lines: Array<Line>, languages: Array<string>): Array<Line> {
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

    record_missing_languages(lines: Array<Line>, languages: Array<string>): Array<string> {
        const languages_in_lines = lines.map(line => line.language?.toLowerCase()).filter(x => x) as Array<string>;
        const all_languages = [...new Set([...languages, ...languages_in_lines])];
        return all_languages;
    }

    parse_header(lines: Array<string>): Pick<RecordBase, "requested" | "options" | "header_lines" | "languages"> {
        const requested = lines[1] === "Record ordered on behalf of the NSIrP";
        const options = this.parse_options(lines[0]);

        const header_lines = lines.filter(line => line.startsWith("<"));
        const languages = this.parse_languages(header_lines);

        return {requested, options, header_lines, languages};
    }

    parse_body(lines: Array<string>): Array<Line> {
        const parsed_lines: Array<Line> = [];

        const sabre_line_regex = /^< *(.+) *>/;
        const label_regex = /^(\w.*?)(?:\(((?:in )?[\w\s]*?)\))? *(?:\(((?:in )?[\w\s]*?)\))? : *(.*)?/;

        let current_label: Omit<Line, "text"> | undefined;
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
                    character: character === "_" ? RecordHelpers.narrator_character : character.trim(), 
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
}

const store = new RecordStore();
export default store;