import * as Endpoint from "../../../endpoint";
import * as ImageQueries from "../../../queries/image"

export const GET = Endpoint.make_handler<"image_description">("image_description", async (request, _override) => {
    const {name} = request;

    const description = await ImageQueries.get_description(name) ?? undefined;
    return {description};
});
