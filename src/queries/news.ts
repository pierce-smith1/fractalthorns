import Db from "../data/db"
import * as Api from "../api/api"
import * as QueryUtil from "./util"

export type BaseNewsItem = Api.NewsItem;

export async function get_all_news(): Promise<Array<BaseNewsItem>> {
    const rows = await Db
        .selectFrom("news")
        .innerJoin("news_item", "news_item.news_id", "news.id")
        .select([
            "news.id as news_id",
            "news.title as news_title",
            "news.date as news_date",
            "news.version as news_version",
            "news_item.text as news_item_text",
        ])
        .execute();

    const items = QueryUtil.coalesce_rows({
        rows,
        get_key: row => row.news_id,
        merge: (representative, rows) => ({
            title: representative.news_title,
            date: representative.news_date,
            version: representative.news_version ?? undefined,
            items: rows.map(x => x.news_item_text),
        }),
    });

    return items;
}
