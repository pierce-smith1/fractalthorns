import * as Endpoint from "../../../endpoint";
import News from "../../../stores/news";

export const GET = Endpoint.use_get_handler<"all_news">(async (request, override) => {
    const news = News.get();

    const client_news = news.map(item => ({...item, 
        items: item.items ?? [], 
        date: item.date.toString(), 
        version: item.version ? item.version : undefined
    }));

    return {items: client_news};
});