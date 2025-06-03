import * as Exp from "drizzle-orm/sqlite-core/expressions";

import Db from "../data/db";
import * as Schema from "../data/schema/schema";
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
    const rows = await Db.query.image.findMany({
        where: Exp.or(
            // TODO: Technically this is SQL injection, but Drizzle provides no way around it
            // and it's probably not a **dangerous** form of injection... the impact should be
            // localized to the LIKE statemenet. Hopefully.
            Exp.like(Schema.image.name, `%${term}%`),
            Exp.like(Schema.image.title, `%${term}%`),
            // TODO: This is also technically not correct because it will search the commas
            // in the list...
            Exp.like(Schema.image.characters, `%${term}%`), 
        ),
    });

    const image_items = rows.map(row => ({
        domain: "image" as const, 
        image: ImageQueries.to_api_object(row),
    }));

    return image_items;
}

export async function find_sketch_items(term: string): ReturnType<typeof find_items> {
    const rows = await Db.query.sketch.findMany({
        where: Exp.or(
            Exp.like(Schema.sketch.name, `%${term}%`),
            Exp.like(Schema.sketch.characters, `%${term}%`), // TODO again, not really correct but close enough...
        ),
    });

    const sketch_items = rows.map(row => ({
        domain: "sketch" as const,
        sketch: SketchQueries.to_api_object(row),
    }));

    return sketch_items;
}

export async function find_episodic_items(term: string): ReturnType<typeof find_items> {
    // TODO: Fucking put a bullet through my god damn head
    const rows = await Db.query.record.findMany({
        with: {
            puzzle_solve: true,
            puzzle_linked_record: {
                with: {
                    puzzle: true,
                }
            }
        },
        where: Exp.like(Schema.record.title, `%${term}%`),
    });

    const record_items = rows.map(row => ({
        domain: "episodic-item" as const,
        record: RecordQueries.to_api_entry_object(row),
    }));

    return record_items;
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