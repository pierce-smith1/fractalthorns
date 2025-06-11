import * as Directory from "./directory";
import * as NewsLoader from "../loaders/news";

export async function detect_and_resolve_changes() {
    const directory_changes = await Directory.get_changes();

    const news_change = directory_changes.find(change => change.path === "/news.json");
    if (!news_change) {
        console.log("No news changes detected");
        return;
    }

    if (news_change.type === "removed") {
        throw new Error("News file was deleted! This is preposterous!");
    }

    console.log("Repopulating news");
    return NewsLoader.repopulate();
}