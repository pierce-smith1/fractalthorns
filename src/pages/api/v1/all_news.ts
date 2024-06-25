import * as NewsLoader from "../../../loaders/news";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"all_news">(async (request, override) => {
    const news = await NewsLoader.get_all();

    const client_news = news.map(item => ({...item, date: item.date.toString(), version: item.version ? item.version : undefined}));
    return {items: client_news};
});