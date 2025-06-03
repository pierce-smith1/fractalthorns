import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

export const puzzle = Sqlite.sqliteTable("puzzle", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull(),
    chapter: Sqlite.text().notNull(),
    solve_behavior: Sqlite.text().notNull(),
    solve_code: Sqlite.text().notNull(),
    primary_color: Sqlite.text(),
    secondary_color: Sqlite.text(),
    type: Sqlite.text().notNull(),
    ordinal: Sqlite.integer().notNull(),
}, table => [
    Sqlite.index("idx_puzzle_name").on(table.name),
    Sqlite.index("idx_puzzle_chapter").on(table.chapter),
]);

export const puzzle_linked_record = Sqlite.sqliteTable("puzzle_linked_record", {
    id: Sqlite.integer().primaryKey(),
    puzzle_id: Sqlite.integer().notNull(),
    record_name: Sqlite.text().notNull(),
});

export const puzzle_solve = Sqlite.sqliteTable("puzzle_solve", {
    id: Sqlite.integer().primaryKey(),
    puzzle_id: Sqlite.integer().notNull(),
    record_id: Sqlite.integer().notNull(),
});

export const puzzle_relation = Drizzle.relations(puzzle, ({many}) => ({
    puzzle_linked_record: many(puzzle_linked_record),
    puzzle_solve: many(puzzle_solve),
}));
