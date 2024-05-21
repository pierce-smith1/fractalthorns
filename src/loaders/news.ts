import Config from "../config";

import * as Filesystem from "../filesystem";
import * as News from "../descriptors/news";

export async function get_all(): Promise<Array<News.Model>> {
    const news_path = `${Config.authorland_root}/news.json`;

    const news_file_contents = await Filesystem.read(news_path);
    const news_models = JSON.parse(news_file_contents) as Array<News.Model>;

    return news_models;
}