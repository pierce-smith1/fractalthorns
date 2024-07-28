import * as ImageLoader from "../../../loaders/image";
import * as Image from "../../../descriptors/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"single_image">(async (request, override) => {
    const name = request.name;

    const image = await ImageLoader.get(name)

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    return Image.to_public_model(image);
});
