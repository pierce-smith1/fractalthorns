import * as NewsQueries from "../../../queries/news"
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"all_news">(async (request, override) => {
    const items = await NewsQueries.get_all_news();
    return {items};
});
