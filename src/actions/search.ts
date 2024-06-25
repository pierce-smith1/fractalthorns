import * as Record from "../descriptors/record";
import * as Episodic from "../loaders/episodic";
import * as RecordLoader from "../loaders/record";

type Invertible<T> = {value: T, not?: boolean};
export type SearchOptions = {
    from_speaker?: Invertible<string>,
    from_species?: Invertible<string>,
    in_iteration?: Invertible<string>,
    in_record?: Invertible<string>,
    in_language?: Invertible<string>,
    limit?: number,
    whole_words?: boolean,
};

type Line = Record.Model["lines"][number];

export type SearchMatch = {
    line: Line,
    line_index: number,
    start_index: number,
    matched_text: string,
};

export type SearchResult = {[record_name: string]: Array<SearchMatch>};

function option_is_satisfied_by<T>(option?: Invertible<T>, value?: T) {
    if (option === undefined) return true;
    if (value === undefined) return false;
    if (option.not && option.value !== value) return true;
    if (option.value === value) return true;
    return false;
}

export async function search(options: SearchOptions, regex_string: string): Promise<SearchResult> {
    const story = await Episodic.get();

    let matches = await Promise.all(story.records.map(async record => {
        const record_model = (await RecordLoader.get(record.name, record.chapter))!;
        return [record.name, await search_in_record({...record_model, title: record.name}, options, regex_string)] as [string, Array<SearchMatch>];
    }));
    matches = matches.filter(match => match[1].length > 0)
    const matches_by_record = Object.fromEntries(matches);

    return matches_by_record;
}

export async function search_in_record(record: Record.Model & {title: string}, options: SearchOptions, regex_string: string): Promise<Array<SearchMatch>> { 
    if (options.whole_words) {
        regex_string = `\\b${regex_string}\\b`;
    }

    const record_matches_filters = option_is_satisfied_by(options.in_record, record.title)
        || option_is_satisfied_by(options.in_iteration, record.options.iter)

    if (!record_matches_filters) {
        return [];
    }

    let matches = [] as Array<SearchMatch>;

    enumerate_lines:
    for (const [line, i] of record.lines.map((line, i) => [line, i] as const)) {

        const line_satisfies_filters = option_is_satisfied_by(options.from_speaker, line.character)
            || option_is_satisfied_by(options.in_language, line.language)

        if (!line_satisfies_filters) {
            continue;
        }

        const search_regex = new RegExp(regex_string, "gi"); // n * m problem because global js regexes are stateful

        let regex_match;
        while ((regex_match = search_regex.exec(line.text)) !== null) {
            matches.push({line, line_index: i, start_index: regex_match.index, matched_text: regex_match[0]});

            if (matches.length >= (options.limit ?? 20)) {
                break enumerate_lines;
            }
        }
    };

    return matches;
}
