import * as Endpoint from "../../../endpoint";
import News from "../../../stores/news";
import * as NewsTransformers from "../../../transformers/news";

export const GET = Endpoint.use_get_handler<"all_news">(async (request, override) => {
    const news = News.get();

    const client_news = news.map(NewsTransformers.to_api_object);

    return {items: client_news};
});