import * as Drizzle from "drizzle-orm";
import * as Sqlite from "drizzle-orm/sqlite-core";

export const news = Sqlite.sqliteTable("news", {
    id: Sqlite.integer().primaryKey(),
    title: Sqlite.text().notNull(),
    date: Sqlite.text().notNull(),
    version: Sqlite.text(),
});

export const news_item = Sqlite.sqliteTable("news_item", {
    id: Sqlite.integer().primaryKey(),
    news_id: Sqlite.integer().notNull(),
    text: Sqlite.text().notNull(),
});

export const news_relation = Drizzle.relations(news, ({many}) => ({
    news_item: many(news_item),
}));

export const news_item_relation = Drizzle.relations(news_item, ({one}) => ({
    news: one(news, {
        fields: [news_item.news_id],
        references: [news.id],
    }),
}));