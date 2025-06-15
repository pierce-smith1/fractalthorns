import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

export const rune = Sqlite.sqliteTable("rune", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull().unique(),
    file_id: Sqlite.integer().notNull(),
}, table => [
    Sqlite.index("idx_rune_name").on(table.name),
]);

export const runeword = Sqlite.sqliteTable("runeword", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull().unique(),
}, table => [
    Sqlite.index("idx_runeword_name").on(table.name),
]);

export const runeword_rune = Sqlite.sqliteTable("runeword_rune", {
    id: Sqlite.integer().primaryKey(),
    rune_name: Sqlite.text().notNull(),
    runeword_name: Sqlite.text().notNull(),
    ordinal: Sqlite.integer().notNull(),
}, table => [
    Sqlite.index("idx_runeword_rune_runeword_name").on(table.runeword_name),
]);

export const rune_relation = Drizzle.relations(rune, ({many}) => ({
    runeword_rune: many(runeword_rune),
}));

export const runeword_relation = Drizzle.relations(runeword, ({many}) => ({
    runeword_rune: many(runeword_rune),
}));

export const runeword_rune_relation = Drizzle.relations(runeword_rune, ({one}) => ({
    rune: one(rune, {
        fields: [runeword_rune.rune_name],
        references: [rune.name],
    }),
    runeword: one(runeword, {
        fields: [runeword_rune.runeword_name],
        references: [runeword.name],
    }),
}));
