import * as Domain from "../descriptors/domain";
import * as Episodic from "../descriptors/episodic";
import * as PublicImage from "../descriptors/image";
import * as GenericUtil from "../genericutil";
import * as EpisodicLoader from "../loaders/episodic";
import * as ImageLoader from "../loaders/image";
import * as Search from "./search";

export async function find_items(term: string, type: Domain.SearchItemType): Promise<Array<Domain.Item>> {
    const lowercase_term = term.toLowerCase();

    const results_promise = (() => {
        switch (type) {
            case "image": return find_image_items(lowercase_term);
            case "episodic-item": return find_episodic_items(lowercase_term);
            case "episodic-line": return find_episodic_lines(lowercase_term);
        }
    })();
    
    const results = await results_promise;
    return results;
}

export async function find_image_items(term: string): ReturnType<typeof find_items> {
    const images = await ImageLoader.get_all();
    const matching_images = images
        .filter(image => 
            image.name.includes(term) || 
            image.title.includes(term) || 
            image.characters?.map?.(char => char.toLowerCase())?.includes?.(term)
        );

    const image_items = matching_images.map(image => ({
        domain: "image" as const, 
        image: PublicImage.to_public_model(image),
    }));
    return image_items;
}

export async function find_episodic_items(term: string): ReturnType<typeof find_items> {
    const episodic = await EpisodicLoader.get();
    const matching_records = episodic.records.filter(record => record.solved && record.title.includes(term));

    const record_items = matching_records.map(record => ({
        domain: "episodic-item" as const, 
        record: Episodic.redact(record)
    }));
    return record_items;
}

export async function find_episodic_lines(term: string): ReturnType<typeof find_items> {
    term = term.trim();

    // Try to guard against braindumps.
    // I GUARANTEE you someone is going to try putting in just an "a" or something,
    // realize they're not getting any results, then try to meticulously craft a payload that
    // will braindump - and they will eventually do it, crying with joy as the server grinds
    // to a halt, proud beyond compare that their incalculable genius has managed to expose 
    // the shit software for the shitness it really is but is trying so deperately to hide.
    // Just a prediction. Was I right?
    if (term.length < 3 || term === "the") {
        return [];
    }

    // Escape regex special characters
    term = term.replace(/[-[\]{}()*+?.,\\&$|#\s]/g, "\\$&");

    const results = await Search.search({whole_words: true, limit: 100}, term);
    const episodic = await EpisodicLoader.get();
    const lines = Object.entries(results)
        .flatMap(([name, matches]) => matches
            .map(match => ({
                domain: "episodic-line" as const,
                record_name: name, 
                line_index: match.line_index,
                record: Episodic.redact(episodic.records.find(record => record.name === name)!), 
                matched_text: match.matched_text,
            }))
        );
    const unique_lines = GenericUtil.unique_by(lines, (a, b) => a.record_name === b.record_name && a.line_index === b.line_index);
    return unique_lines;
}