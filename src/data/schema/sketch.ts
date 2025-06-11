import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

export const sketch = Sqlite.sqliteTable("sketch", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull().unique(),
    ordinal: Sqlite.integer().notNull(),
    file_id: Sqlite.integer().notNull(),
    thumbnail_file_id: Sqlite.integer().notNull(),
    characters: Sqlite.text(),
    primary_color: Sqlite.text(),
    secondary_color: Sqlite.text(),
}, table => [
    Sqlite.index("idx_sketch_name").on(table.name),
    Sqlite.index("idx_sketch_ordinal").on(table.ordinal),
]);