import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

export const rune = Sqlite.sqliteTable("rune", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull(),
    file_id: Sqlite.integer().notNull(),
});

export const runeword = Sqlite.sqliteTable("runeword", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull(),
}, table => [
    Sqlite.index("idx_runeword_name").on(table.name)
]);

export const runeword_rune = Sqlite.sqliteTable("runeword_rune", {
    id: Sqlite.integer().primaryKey(),
    rune_id: Sqlite.integer().notNull(),
    runeword_id: Sqlite.integer().notNull(),
});

export const rune_relation = Drizzle.relations(rune, ({many}) => ({
    runeword_rune: many(runeword_rune),
}));

export const runeword_relation = Drizzle.relations(runeword, ({many}) => ({
    runeword_rune: many(runeword_rune),
}));

export const runeword_rune_relation = Drizzle.relations(runeword_rune, ({one}) => ({
    rune: one(rune, {
        fields: [runeword_rune.rune_id],
        references: [rune.id],
    }),
    runeword: one(runeword, {
        fields: [runeword_rune.runeword_id],
        references: [runeword.id],
    }),
}));
