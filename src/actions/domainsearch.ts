import * as Domain from "../helpers/domain";
import * as ImageQueries from "../queries/image";
import * as RecordQueries from "../queries/record.ts";
import * as SketchQueries from "../queries/sketch";
import * as Search from "./search";

export async function find_items(term: string, type: Domain.SearchItemType): Promise<Array<Domain.Item>> {
    const lowercase_term = term.toLowerCase();

    const results_promise = (() => {
        switch (type) {
            case "image": return find_image_items(lowercase_term);
            case "sketch": return find_sketch_items(lowercase_term);
            case "episodic-item": return find_episodic_items(lowercase_term);
            case "episodic-line": return find_episodic_lines(lowercase_term);
        }
    })();
    
    const results = await results_promise;
    return results;
}

export async function find_image_items(term: string): ReturnType<typeof find_items> {
    const images = await ImageQueries.get_matching(term);
    const items = images.map(x => ({
        domain: "image" as const,
        image: x,
    }));

    return items;
}

export async function find_sketch_items(term: string): ReturnType<typeof find_items> {
    const sketches = await SketchQueries.get_matching(term);
    const items = sketches.map(x => ({
        domain: "sketch" as const,
        sketch: x,
    }));

    return items;
}

export async function find_episodic_items(term: string): ReturnType<typeof find_items> {
    const records = await RecordQueries.get_matching(term);
    const items = records.map(x => ({
        domain: "episodic-item" as const,
        record: x,
    }));

    return items;
}

export async function find_episodic_lines(term: string): ReturnType<typeof find_items> {
    term = term.trim();

    // Try to guard against braindumps. There is no good reason to ask for one
    if (term.length < 3 || term === "the") {
        return [];
    }

    // Escape regex special characters
    term = term.replace(/[-[\]{}()*+?.,\\&$|#\s]/g, "\\$&");

    const results = await Search.search({whole_words: true, limit: 100}, term);
    const lines = Object.entries(results)
        .flatMap(([name, matches]) => matches
            .map(match => ({
                domain: "episodic-line" as const,
                record_name: name, 
                line_index: match.line_index,
                record: match.record.entry,
                matched_text: match.matched_text,
            }))
        );
    return lines;
}
