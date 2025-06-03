import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

export const record = Sqlite.sqliteTable("record", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull(),
    title: Sqlite.text().notNull(),
    canon: Sqlite.text().notNull(),
    chapter: Sqlite.text().notNull(),
    ordinal: Sqlite.integer().notNull(),
    requested: Sqlite.integer().notNull(),
    languages: Sqlite.text().notNull(),
    characters: Sqlite.text().notNull(),
    format: Sqlite.text(),
    always_discovered: Sqlite.integer().notNull(),
}, table => [
    Sqlite.index("idx_record_name").on(table.name),
]);

export const record_line = Sqlite.sqliteTable("record_line", {
    id: Sqlite.integer().primaryKey(),
    record_id: Sqlite.integer().notNull(),
    type: Sqlite.text().notNull(),
    character: Sqlite.text(),
    language: Sqlite.text(),
    emphasis: Sqlite.text(),
    text: Sqlite.text().notNull(),
    ordinal: Sqlite.integer().notNull(),
}, table => [
    Sqlite.index("idx_record_line_record_id").on(table.record_id),
    Sqlite.index("idx_record_line_ordinal").on(table.ordinal),
]);

export const record_header_line = Sqlite.sqliteTable("record_header_line", {
    id: Sqlite.integer().primaryKey(),
    record_id: Sqlite.integer().notNull(),
    text: Sqlite.text().notNull(),
}, table => [
    Sqlite.index("idx_record_header_line_record_id").on(table.record_id),
]);

export const record_line_relation = Drizzle.relations(record_line, ({one}) => ({
    record: one(record, {
        fields: [record_line.record_id],
        references: [record.id],
    }),
}));

export const record_header_line_relation = Drizzle.relations(record_header_line, ({one}) => ({
    record: one(record, {
        fields: [record_header_line.record_id],
        references: [record.id],
    }),
}));