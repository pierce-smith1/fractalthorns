import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

import * as PuzzleSchema from "./puzzle";
import * as RecordSchema from "./record";

export * from "./news";
export * from "./image";
export * from "./sketch";
export * from "./record";
export * from "./puzzle";
export * from "./rune";

export const file = Sqlite.sqliteTable("file", {
    id: Sqlite.integer().primaryKey(),
    data: Sqlite.blob({mode: "buffer"}).notNull(),
    hash: Sqlite.text().notNull(),
});

export const directory = Sqlite.sqliteTable("directory", {
    id: Sqlite.integer().primaryKey(),
    path: Sqlite.text().notNull(),
    modified_ms: Sqlite.integer().notNull(),
});

export const puzzle_linked_record_relation = Drizzle.relations(PuzzleSchema.puzzle_linked_record, ({one}) => ({
    puzzle: one(PuzzleSchema.puzzle, {
        fields: [PuzzleSchema.puzzle_linked_record.puzzle_id],
        references: [PuzzleSchema.puzzle.id],
    }),
    record: one(RecordSchema.record, {
        fields: [PuzzleSchema.puzzle_linked_record.record_name],
        references: [RecordSchema.record.name],
    }),
}));

export const puzzle_solve_relation = Drizzle.relations(PuzzleSchema.puzzle_solve, ({one}) => ({
    puzzle: one(PuzzleSchema.puzzle, {
        fields: [PuzzleSchema.puzzle_solve.puzzle_id],
        references: [PuzzleSchema.puzzle.id],
    }),
    record: one(RecordSchema.record, {
        fields: [PuzzleSchema.puzzle_solve.record_id],
        references: [RecordSchema.record.id],
    }),
}));

export const record_relation = Drizzle.relations(RecordSchema.record, ({many}) => ({
    record_line: many(RecordSchema.record_line),
    record_header_line: many(RecordSchema.record_header_line),
    puzzle_linked_record: many(PuzzleSchema.puzzle_linked_record),
    puzzle_solve: many(PuzzleSchema.puzzle_solve),
}));