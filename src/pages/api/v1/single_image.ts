import * as Endpoint from "../../../endpoint";
import * as ImageQueries from "../../../queries/image";

export const GET = Endpoint.make_handler<"single_image">(async (request, override) => {
    const {name} = request;

    const image = name
        ? await ImageQueries.get_one(name)
        : await ImageQueries.get_latest();

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    return image;
});
