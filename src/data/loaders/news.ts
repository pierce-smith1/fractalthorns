import Config from '../../config';
import * as Filesystem from '../../filesystem';
import Db from '../db';
import * as Schema from '../schema/schema';

type News = {
    title: string,
    date: string,
    items?: Array<string>,
    version?: string,
};

export async function repopulate() {
    await Db.delete(Schema.news);
    await Db.delete(Schema.news_item);

    const news_path = `${Config.content_root}/news.json`;

    const news = JSON.parse(await Filesystem.read(news_path)) as Array<News>;

    return Promise.all(news.map(async entry => {
        const [news_row] = await Db.insert(Schema.news).values({
            title: entry.title,
            date: new Date(entry.date).toISOString(),
            version: entry.version,
        }).returning();

        return Promise.all((entry.items ?? []).map(async item => 
            Db.insert(Schema.news_item).values({
                news_id: news_row.id,
                text: item,
            })
        )).then(() => console.log(`Added news entry ${entry.title}`));
    }));
}