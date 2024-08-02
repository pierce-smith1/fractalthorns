import Config from "../config";

import * as Store from "./_store";
import * as Filesystem from "../filesystem";

export type NewsItem = {
    title: string,
    items: Array<string>,
    date: Date,
    version?: string,
};

export class NewsStore extends Store.Store<NewsItem> {
    async load() {
        const news_path = `${Config.authorland_root}/news.json`;

        const news_file_contents = await Filesystem.read(news_path);
        const news_models = JSON.parse(news_file_contents) as Array<NewsItem>;

        return news_models;
    }
}

const store = new NewsStore();
export default store;