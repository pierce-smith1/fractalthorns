import * as Domain from "../descriptors/domain";
import * as ImageLoader from "../loaders/image";
import * as EpisodicLoader from "../loaders/episodic";
import * as Search from "./search";

export async function find_items(term: string, type: Domain.SearchItemType): Promise<Array<Domain.PageSearchResult>> {
    const results_promise = (() => {
        switch (type) {
            case "image": return find_image_items(term);
            case "episodic-item": return find_episodic_items(term);
            case "episodic-line": return find_episodic_lines(term);
        }
    })();
    
    const results = await results_promise;
    return results;
}

export async function find_image_items(term: string): ReturnType<typeof find_items> {
    const images = await ImageLoader.get_all();
    const matching_images = images.filter(image => image.name.includes(term) || image.title.includes(term));
    const image_items = matching_images.map(image => ({domain: "image" as const, name: image.name}));
    return image_items;
}

export async function find_episodic_items(term: string): ReturnType<typeof find_items> {
    const episodic = await EpisodicLoader.get();
    const matching_records = episodic.records.filter(record => record.solved && record.name.includes(term));
    const record_items = matching_records.map(record => ({domain: "episodic" as const, record_name: record.name}));
    return record_items;
}

export async function find_episodic_lines(term: string): ReturnType<typeof find_items> {
    const results = await Search.search({whole_words: true}, term);
    const lines = Object.entries(results)
        .flatMap(([name, matches]) => matches
            .map(match => ({domain: "episodic" as const, record_name: name, line_index: match.line_index, matched_text: match.matched_text}))
        );
    return lines;
}