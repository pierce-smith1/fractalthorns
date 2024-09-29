import * as Endpoint from "../../../endpoint";
import * as NewsLoader from "../../../loaders/news";
import * as NewsTransformers from "../../../transformers/news";

export const GET = Endpoint.use_get_handler<"all_news">(async (request, override) => {
    const news = await NewsLoader.load_all();

    const client_news = news.map(NewsTransformers.to_api_object);

    return {items: client_news};
});