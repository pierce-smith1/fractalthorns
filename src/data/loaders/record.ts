import * as Kysely from "kysely"

import Config from "../../config"
import * as Filesystem from "../../filesystem"
import * as RecordHelpers from "../../helpers/record"
import Db from "../db"
import * as Schema from "../schema/schema"
import * as PuzzleLoader from "./puzzle"

type StoryDefinition = Array<{
    chapter_name: string,
    records: Array<Omit<RecordEntry, "chapter">>,
}>;

type RecordEntry = {
    iteration: string,
    name: string,
    chapter: string,
};

async function get_ordered_records(): Promise<Array<RecordEntry>> {
    const story_path = `${Config.content_root}/records/story.json`;
    const story_definition = JSON.parse(await Filesystem.read(story_path)) as StoryDefinition;

    const ordered_records = story_definition.flatMap(chapter_entry => chapter_entry.records.map(record => ({
        ...record,
        chapter: chapter_entry.chapter_name,
    })));

    return ordered_records;
}

export async function regenerate_story_outline() {
    console.log("Regenerating story outline...");

    const ordered_records = await get_ordered_records();

    const puzzles_definition_path = `${Config.content_root}/puzzles/puzzles.json`;
    const puzzles_definition = JSON.parse(await Filesystem.read(puzzles_definition_path)) as PuzzleLoader.PuzzlesDefinition;

    const records = await Promise.all(ordered_records.map(async ({iteration, name, chapter}) => {
        const record_path = `${Config.content_root}/records/chapter-${chapter}/${name}.txt`;
        const record_text = await Filesystem.read(record_path);

        const record_lines = parse_from(record_text);

        return {iteration, lines: record_lines, chapter, name};
    }));

    return Promise.all(records.map(async record => {
        return ensure_record_row(record.lines, {...record}, ordered_records, puzzles_definition);
    })).then(() => console.log("Regenerated story outline"));
}

async function ensure_record_row(
    record: RecordBase,
    entry: RecordEntry,
    ordered_records: Array<RecordEntry>,
    puzzles_definition: PuzzleLoader.PuzzlesDefinition
): Promise<Kysely.Selectable<Schema.RecordTable>> {
    const ordinal = ordered_records.findIndex(x => x.name === entry.name) + 1;
    const iteration = ordered_records.find(x => x.name === entry.name)!.iteration;

    const new_row = {
        name: entry.name,
        title: RecordHelpers.record_name_to_title(entry.name),
        canon: iteration,
        chapter: entry.chapter,
        ordinal,
        requested: record.requested ? 1 : 0,
        languages: record.languages.join(","),
        characters: record.characters.join(","),
        format: record.options.fmt,
        always_discovered: puzzles_definition.some(x => x.chapter === entry.chapter) ? 0 : 1,
    };

    const row = await Db
        .insertInto("record")
        .values(new_row)
        .onConflict(oc => oc
            .column("name")
            .doUpdateSet(new_row)
         )
         .returningAll()
         .executeTakeFirstOrThrow();

    return row;
}

export async function regenerate_record_lines(name: string, chapter: string) {
    console.log(`Upserting record ${name}`);

    const record_path = `${Config.content_root}/records/chapter-${chapter}/${name}.txt`;
    const record_text = await Filesystem.read(record_path);

    const record_lines = parse_from(record_text);

    const existing_record_row = await Db
        .selectFrom("record")
        .selectAll()
        .where("name", "=", name)
        .executeTakeFirst();

    const record_row = existing_record_row
        ?? await ensure_record_row(
            record_lines, 
            {
                name, 
                chapter, 
                iteration: record_lines.options.iter
            },
            await get_ordered_records(),
            await PuzzleLoader.get_puzzles_definition()
        );

    const delete_lines_promise = Db
        .deleteFrom("record_line")
        .where("record_id", "=", record_row.id)
        .execute();

    const delete_header_lines_promise = Db
        .deleteFrom("record_header_line")
        .where("record_header_line.id", "=", record_row.id)
        .execute();

    await Promise.all([
        delete_lines_promise,
        delete_header_lines_promise,
    ]);

    const header_line_insert_promise = Promise.all(record_lines.header_lines.map(async (header_line, i) => Db
        .insertInto("record_header_line")
        .values({
            record_id: record_row.id,
            text: header_line,
            ordinal: i + 1,
        })
        .execute()
    ));

    const line_insert_promise = Promise.all(record_lines.lines.map(async (line, i) => Db
        .insertInto("record_line")
        .values({
            record_id: record_row.id,
            type: line.type,
            character: line.character,
            language: line.language,
            emphasis: line.emphasis,
            text: line.text,
            ordinal: i + 1,
        })
        .execute()
    ));

    return Promise.all([
        header_line_insert_promise,
        line_insert_promise
    ]).then(() => console.log(`Regenerated lines for record ${name}`));
}

export async function delete_record_lines(name: string): Promise<void> {
    console.log(`Deleting record ${name}`);

    const existing_record_row = await Db
        .selectFrom("record")
        .selectAll()
        .where("name", "=", name)
        .executeTakeFirst();

    if (existing_record_row) {
        const delete_lines_promise = Db
            .deleteFrom("record_line")
            .where("record_id", "=", existing_record_row.id)
            .execute();

        const delete_header_lines_promise = Db
            .deleteFrom("record_header_line")
            .where("record_header_line.id", "=", existing_record_row.id)
            .execute();

        return Promise.all([
            delete_lines_promise,
            delete_header_lines_promise
        ]).then(() => console.log(`Deleted record ${name}`));
    }
}

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

export function parse_from(record_contents: string): RecordBase {
    // Only trim the end because some markdown shit like lists has significant whitespace at the start
    const lines = record_contents.split("\n").map(line => line.trimEnd());

    const {header, body} = get_parts(lines);
    const parsed_header = parse_header(header);
    const parsed_lines = parse_body(body);

    const characters = (() => {
        const chars = parsed_lines
            .map(line => line.character)
            .filter(x => x) as Array<string>;
        
        const sorted = chars.toSorted();
        const unique = [...new Set(sorted)];

        return unique;
    })();
    
    const record = {...parsed_header, characters, lines: parsed_lines};
    record.lines = assign_missing_languages(record.lines, record.languages);
    record.languages = record_missing_languages(record.lines, record.languages);

    return record;
}
    
function get_parts(lines: Array<string>): {header: Array<string>, body: Array<string>} {
    // The header ends at the first blank line after the bracket lines.
    const header_end_index = lines.findIndex((line, i, lines) => (line.startsWith("<") || line.startsWith("[")) && lines[i + 1] === "") + 1;

    const header = lines.slice(0, header_end_index);
    const body = lines.slice(header_end_index + 1);

    return {header, body};
}

function parse_options(options: string): RecordBase["options"] {
        const pairs_list = options.substring(2, options.length - 2);
        const pairs = pairs_list.split(",");
        const entries = pairs.map(pair => pair.split("="));
        const object = Object.fromEntries(entries) as RecordBase["options"];

        return object;
    }

function parse_languages_from_sabre_header(header_lines: Array<string>): Array<string> {
    const language_def_regex = /iteration\[.+\]\..+\.(.+) ->/;
    const language_lines = header_lines.filter(line => line.match(language_def_regex));
    const languages = language_lines.map(line => line.match(language_def_regex)![1]);
    
    return languages;
}

function parse_languages_from_ember_header(header_lines: Array<string>): Array<string> {
    const language_def_regex = /-\/-\s+(\w+)\s+to\s+\w+/;
    const language_lines = header_lines.filter(line => line.match(language_def_regex));
    const languages = language_lines.map(line => line.match(language_def_regex)![1]);

    return languages;
}

function assign_missing_languages(lines: Array<Line>, languages: Array<string>): Array<Line> {
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

function record_missing_languages(lines: Array<Line>, languages: Array<string>): Array<string> {
    const languages_in_lines = lines.map(line => line.language?.toLowerCase()).filter(x => x) as Array<string>;
    const all_languages = [...new Set([...languages, ...languages_in_lines])];
    return all_languages;
}

function parse_header(lines: Array<string>): Pick<RecordBase, "requested" | "options" | "header_lines" | "languages"> {
    const requested = lines[1] === "Record ordered on behalf of the NSIrP";
    const options = parse_options(lines[0]);

    const header_lines = lines.filter(line => line.startsWith("<") || line.startsWith("["));
    const header_type = header_lines.some(line => line.startsWith("[")) ? "ember" : "sabre";
    const languages = header_type === "sabre"
        ? parse_languages_from_sabre_header(header_lines)
        : parse_languages_from_ember_header(header_lines);

    return {requested, options, header_lines, languages};
}

function parse_body(lines: Array<string>): Array<Line> {
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

            const language = [modifier_1, modifier_2].find(modifier => modifier?.startsWith("in "))?.substring(3);
            const emphasis = [modifier_1, modifier_2].find(modifier => modifier && !modifier.startsWith("in "));
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
