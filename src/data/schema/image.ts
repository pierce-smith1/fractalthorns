import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

export const image = Sqlite.sqliteTable("image", {
    id: Sqlite.integer().primaryKey(),
    name: Sqlite.text().notNull(),
    title: Sqlite.text().notNull(),
    date: Sqlite.text().notNull(),
    canon: Sqlite.text(),
    speedpaint_url: Sqlite.text(),
    ordinal: Sqlite.integer().notNull(),
    file_id: Sqlite.integer().notNull(),
    thumbnail_file_id: Sqlite.integer().notNull(),
    description: Sqlite.text(),
    characters: Sqlite.text(),
    primary_color: Sqlite.text(),
    secondary_color: Sqlite.text(),
}, table => [
    Sqlite.index("idx_image_name").on(table.name),
    Sqlite.index("idx_image_ordinal").on(table.ordinal),
]);