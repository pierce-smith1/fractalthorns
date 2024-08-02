import Images from "../../../stores/image";
import * as ImageTransformers from "../../../transformers/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"single_image">(async (request, override) => {
    const name = request.name;

    const image = name
        ? Images.get().find(image => image.name === name)
        : Images.get().toSorted((a, b) => b.date.valueOf() - a.date.valueOf())[0];

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    return ImageTransformers.to_api_object(image);
});
