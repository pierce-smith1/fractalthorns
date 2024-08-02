import Config from "../config";

import * as Store from "./_store";
import * as Filesystem from "../filesystem";

export type RawNewsItem = {
    title: string,
    items: Array<string>,
    date: Date,
    version?: string,
};

export type NewsItem = Omit<RawNewsItem, "date"> & {
    date: Date,
};

export class NewsStore extends Store.Store<NewsItem> {
    async load() {
        const news_path = `${Config.authorland_root}/news.json`;

        const news_file_contents = await Filesystem.read(news_path);
        const raw_news_models = JSON.parse(news_file_contents) as Array<RawNewsItem>;
        const news_models = raw_news_models.map(item => ({...item, date: new Date(item.date)}));

        return news_models;
    }
}

const store = new NewsStore();
export default store;