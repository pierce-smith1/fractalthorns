import * as Api from "../api/api";
import Db from "../data/db";
import * as QueryUtil from "./util"
import * as Util from "../genericutil"

export type BaseRecordEntry = Api.RedactableRecordEntry;

const base_entry = QueryUtil.make_base_query(Db
    .selectFrom("record")
    .leftJoin("puzzle_solve", "puzzle_solve.record_id", "record.id")
    .leftJoin("puzzle_linked_record", "puzzle_linked_record.record_name", "record.name")
    .leftJoin("puzzle", "puzzle.id", "puzzle_linked_record.id")
    .select([
        "record.id as record_id",
        "record.name as record_name",
        "record.title as record_title",
        "record.canon as record_iteration",
        "record.chapter as record_chapter",
        "record.always_discovered as record_always_discovered",
        "puzzle_solve.puzzle_id as solving_puzzle_id",
        "puzzle.name as linked_puzzle_name",
    ]),
    (representative, rows) => ({
        solved: is_solved(representative),
        chapter: representative.record_chapter,
        name: representative.record_name,
        title: is_solved(representative) ? representative.record_title : undefined,
        iteration: is_solved(representative) ? representative.record_iteration : undefined,
        linked_puzzles: Util.undefined_if_all_null(rows.map(x => x.linked_puzzle_name)),
    }),
);

export async function get_all_entries(): Promise<Array<BaseRecordEntry>> {
    const rows = await base_entry.query.execute();

    const entries = QueryUtil.coalesce_rows({
        rows,
        get_key: row => row.record_id,
        merge: base_entry.merge_fn,
    });

    return entries;
}

export async function get_one_entry(name: string): Promise<Api.RedactableRecordEntry | null> {
    const rows = await base_entry.query
        .where("record_name", "=", "name")
        .execute();

    if (rows.length === 0) {
        return null;
    }

    const entry = QueryUtil.coalesce_to_one({
        rows,
        merge: base_entry.merge_fn
    });

    return entry;
}

export async function get_first_entry(): Promise<Api.RedactableRecordEntry | null> {
    const rows = await base_entry.query
        .select("record.ordinal as record_ordinal")
        .orderBy("record_ordinal", "asc")
        .execute();

    if (rows.length === 0) {
        return null;
    }

    const entry = QueryUtil.coalesce_to_one({
        rows,
        merge: base_entry.merge_fn,
    });

    return entry;
}

const base_text = QueryUtil.make_base_query(Db
    .selectFrom("record")
    .leftJoin("record_line", "record_line.record_id", "record.id")
    .leftJoin("record_header_line", "record_header_line.record_id", "record.id")
    .leftJoin("puzzle_solve", "puzzle_solve.record_id", "record.id")
    .select([
        "record.id as record_id",
        "record.name as record_name",
        "record.canon as record_iteration",
        "record.languages as record_languages",
        "record.characters as record_characters",
        "record.format as record_format",
        "record.requested as record_requested",
        "record.always_discovered as record_always_discovered",
        "record_line.id as record_line_id",
        "record_line.type as record_line_type",
        "record_line.character as record_line_character",
        "record_line.language as record_line_language",
        "record_line.emphasis as record_line_emphasis",
        "record_line.text as record_line_text",
        "record_header_line.id as record_header_line_id",
        "record_header_line.text as record_header_line_text",
        "puzzle_solve.puzzle_id as solving_puzzle_id",
    ]),
    (representative, rows) => ({
        requested: !!representative.record_requested,
        iteration: representative.record_iteration,
        format: representative.record_format ?? undefined,
        header_lines: Util.unique_by(rows, (a, b) => a.record_header_line_id === b.record_header_line_id)
            .map(x => x.record_header_line_text!),
        languages: representative.record_languages.split(","),
        characters: representative.record_characters.split(","),
        lines: Util.unique_by(rows, (a, b) => a.record_line_id === b.record_line_id).map(x => ({
            type: x.record_line_type!,
            character: x.record_line_character ?? undefined,
            language: x.record_line_language ?? undefined,
            emphasis: x.record_line_emphasis ?? undefined,
            text: x.record_line_text!,
        })),
    }),
);

export type BaseRecordText = Api.RecordTextResponse;

export async function get_one_text(name: string): Promise<Api.RecordTextResponse | null | "unsolved"> {
    const rows = await base_text.query
        .where("record.name", "=", name)
        .execute();

    if (rows.length === 0) {
        return null;
    }

    if (!is_solved(rows[0])) {
        return "unsolved";
    }

    const text = QueryUtil.coalesce_to_one({
        rows,
        merge: base_text.merge_fn,
    });

    return text;
}

export async function get_first_text(): Promise<Api.RecordTextResponse | null | "unsolved"> {
    const rows = await base_text.query
        .where("record.ordinal", "=", 1)
        .execute();

    if (rows.length === 0) {
        return null;
    }

    if (!is_solved(rows[0])) {
        return "unsolved";
    }

    const text = QueryUtil.coalesce_to_one({
        rows,
        merge: base_text.merge_fn,
    });

    return text;
}

export async function get_all_text(): Promise<Array<{text: Api.RecordTextResponse, entry: Api.RedactableRecordEntry}>> {
    const rows = await Db
        .selectFrom("record")
        .leftJoin("record_line", "record_line.record_id", "record.id")
        .leftJoin("record_header_line", "record_header_line.record_id", "record.id")
        .leftJoin("puzzle_linked_record", "puzzle_linked_record.record_name", "record_name")
        .leftJoin("puzzle_solve", "puzzle_solve.record_id", "record.id")
        .leftJoin("puzzle", "puzzle.id", "puzzle_linked_record.puzzle_id")
        .select([
            "record.id as record_id",
            "record.name as record_name",
            "record.title as record_title",
            "record.chapter as record_chapter",
            "record.canon as record_iteration",
            "record.languages as record_languages",
            "record.characters as record_characters",
            "record.format as record_format",
            "record.requested as record_requested",
            "record.always_discovered as record_always_discovered",
            "record_line.id as record_line_id",
            "record_line.type as record_line_type",
            "record_line.character as record_line_character",
            "record_line.language as record_line_language",
            "record_line.emphasis as record_line_emphasis",
            "record_line.text as record_line_text",
            "record_header_line.id as record_header_line_id",
            "record_header_line.text as record_header_line_text",
            "puzzle_solve.puzzle_id as solving_puzzle_id",
            "puzzle.name as linked_puzzle_name",
        ])
        .execute();

    const objects = QueryUtil.coalesce_rows({
        rows: rows.filter(is_solved),
        get_key: row => row.record_id,
        merge: (representative, rows) => ({
            text: base_text.merge_fn(representative, rows),
            entry: base_entry.merge_fn(representative, rows),
        }),
    });

    return objects;
}

function is_solved(row: {record_always_discovered: number, solving_puzzle_id: number | null}) {
    return !!row.record_always_discovered || row.solving_puzzle_id != null;
}
