import * as ImageQueries from "../../../queries/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"all_images">("all_images", async (_request, _override) => {
    const images = await ImageQueries.get_all();
    return {images};
});
