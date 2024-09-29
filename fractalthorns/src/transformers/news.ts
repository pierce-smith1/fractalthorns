import * as News from "../loaders/news";
import * as Api from "../api";

export function to_api_object(news_item: News.NewsItem): Api.NewsItem {
    const object = {
        title: news_item.title,
        date: news_item.date.toISOString().split("T")[0],
        items: news_item.items,
        version: news_item.version,
    };

    return object;
}