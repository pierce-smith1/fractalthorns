import * as NewsQueries from "../../../queries/news"
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"all_news">("all_news", async (_request, _override) => {
    const items = await NewsQueries.get_all_news();
    return {items};
});
