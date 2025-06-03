import * as Exp from "drizzle-orm/sqlite-core/expressions";

import * as Api from "../api/api";
import Db from "../data/db";
import * as Schema from "../data/schema/schema";

const base_entry_query = {
    with: {
        puzzle_solve: true,
        puzzle_linked_record: {
            with: {
                puzzle: true,
            }
        }
    },
} as const;
type BaseEntryQueryRow = Exclude<Awaited<ReturnType<typeof Db.query.record.findFirst<typeof base_entry_query>>>, undefined>;

const base_text_query = {
    with: {
        record_line: true,
        record_header_line: true,
        puzzle_solve: true,
    },
} as const;
type BaseTextQueryRow = Exclude<Awaited<ReturnType<typeof Db.query.record.findFirst<typeof base_text_query>>>, undefined>;

const base_all_query = {
    with: {
        ...base_text_query.with,
        ...base_entry_query.with
    } 
}as const;
type BaseAllQueryRow = Exclude<Awaited<ReturnType<typeof Db.query.record.findFirst<typeof base_all_query>>>, undefined>;

export async function get_all_entries(): Promise<Array<Api.RedactableRecordEntry>> {
    const rows = await Db.query.record.findMany({
        ...base_entry_query,
        orderBy: Exp.asc(Schema.record.ordinal),
    });

    const records = rows.map(to_api_entry_object);
    return records;
}

export async function get_one_entry(name: string): Promise<Api.RedactableRecordEntry | null> {
    const row = await Db.query.record.findFirst({
        ...base_entry_query,
        where: Exp.eq(Schema.record.name, name),
    });

    if (!row) {
        return null;
    }

    return to_api_entry_object(row);
}

export async function get_one_text(name: string): Promise<Api.RecordTextResponse | null | "unsolved"> {
    const row = await Db.query.record.findFirst({
        ...base_text_query,
        where: Exp.eq(Schema.record.name, name),
    });

    if (!row) {
        return null;
    }

    if (!is_solved(row)) {
        return "unsolved";
    }

    const record_text = to_api_text_object(row);
    return record_text;
}

export async function get_all_text(): Promise<Array<{text: Api.RecordTextResponse, entry: Api.RedactableRecordEntry}>> {
    const rows = await Db.query.record.findMany({
        ...base_all_query,
    });

    const record_texts = rows.map(row => ({
        text: to_api_text_object(row),
        entry: to_api_entry_object(row),
    }));

    return record_texts;
}

export function to_api_entry_object(row: BaseEntryQueryRow): Api.RedactableRecordEntry {
    const record = {
        solved: is_solved(row),
        chapter: row.chapter,
        name: row.name,
        title: row.title,
        iteration: is_solved(row) ? row.canon : undefined,
        linked_puzzles: row.puzzle_linked_record.map(x => x.puzzle.name),
    };

    return record;
}

export function is_solved(row: BaseTextQueryRow | BaseEntryQueryRow): boolean {
    return !!row.always_discovered || row.puzzle_solve.length > 0;
}

export function to_api_text_object(row: BaseTextQueryRow): Api.RecordTextResponse {
    const record_text = {
        requested: !!row.requested,
        iteration: row.canon,
        format: row.format ?? undefined,
        header_lines: row.record_header_line.map(x => x.text),
        languages: row.languages.split(","),
        characters: row.languages.split(","),
        lines: row.record_line.map(line_row => ({
            type: line_row.type,
            character: line_row.character ?? undefined,
            language: line_row.language ?? undefined,
            emphasis: line_row.emphasis ?? undefined,
            text: line_row.text,
        })),
    };

    return record_text;
}