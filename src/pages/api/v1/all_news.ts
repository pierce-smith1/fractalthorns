import Db from "../../../data/db";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"all_news">(async (request, override) => {
    const news_rows = await Db.query.news.findMany({
        with: {
            news_item: true,
        }
    });

    const news = news_rows.map(row => ({
        title: row.title,
        date: new Date(row.date).toISOString().substring(0, 10),
        version: row.version ?? undefined,
        items: row.news_item.map(item => item.text)
    }));

    return {items: news};
});