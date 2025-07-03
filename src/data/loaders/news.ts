import Config from "../../config";
import * as Filesystem from "../../filesystem";
import * as ImageHelpers from "../../helpers/image";
import Db from "../db";

type News = {
    title: string,
    date: string,
    items?: Array<string>,
    version?: string,
};

export async function repopulate() {
    await Promise.all([
        Db.deleteFrom("news").execute(),
        Db.deleteFrom("news_item").execute(),
    ]);

    const news_path = `${Config.content_root}/news.json`;
    const news = JSON.parse(await Filesystem.read(news_path)) as Array<News>;

    const insert_promises = news.map(async entry => {
        const news_row = await Db
            .insertInto("news")
            .values({
                title: entry.title,
                date: ImageHelpers.american_to_iso_date(entry.date),
                version: entry.version,
            })
            .returningAll()
            .executeTakeFirstOrThrow();

        const item_insert_promises = (entry.items ?? []).map(async item => Db
            .insertInto("news_item")
            .values({
                news_id: news_row.id,
                text: item,
            })
            .execute()
        );

        return Promise.all(item_insert_promises)
            .then(() => console.log(`Added news entry ${entry.title}`));
    });

    return Promise.all(insert_promises)
        .then(() => console.log("Repopulated news"));
}
