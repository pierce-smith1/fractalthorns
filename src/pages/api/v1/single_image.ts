import * as ImageLoader from "../../../loaders/image";
import * as PublicImage from "../../../descriptors/public/image";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"single_image">(async (request, override) => {
    const name = request.name;

    const all_images = await ImageLoader.get_all();
    const image = name ? all_images.find(image => image.name === name) : all_images[0];

    if (!image) {
        return override(new Response(null, {status: 404}));
    }

    const [primary_color, secondary_color] = await ImageLoader.get_dominant_colors(image.name);
    
    const cheap_model = PublicImage.to_cheap_public_model(image, all_images);
    const model = {...cheap_model,
        primary_color,
        secondary_color,
    };

    return model;
});