import * as Api from "../api";

export type Model = {
    name: string,
    title: string,
    date: Date,
    image_url: string,
    thumb_url: string,
    center: { x: number, y: number },
    canon?: string,
    characters?: Array<string>,
    description?: string,
    speedpaint_video_id?: string,
    primary_color?: string,
    secondary_color?: string,
};

export function speedpaint_id_to_url(id: string) {
    return `https://youtube.com/watch?v=${id}`;
}

export function get_date_string(image_date: string | Date) {
    const date = new Date(image_date);
    const formatted_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formatted_date;
}

export function to_public_model(image: Model, all_images: Array<Model>): Api.ImageObject {
    const client_image = {
        name: image.name,
        title: image.title,
        date: image.date.toISOString().split("T")[0], // lol
        ordinal: all_images.length - all_images.findIndex(other => other.name === image.name), 
        image_url: image.image_url,
        thumb_url: image.thumb_url,
        canon: image.canon,
        has_description: !!image.description,
        characters: image.characters ?? [],
        speedpaint_video_url: image.speedpaint_video_id ? speedpaint_id_to_url(image.speedpaint_video_id) : undefined,
        primary_color: image.primary_color,
        secondary_color: image.secondary_color,
    };
    return client_image;
}