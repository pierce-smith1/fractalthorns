export type Model = {
    name: string,
    title: string,
    date: Date,
    image_url: string,
    thumb_url: string,
    center: { x: number, y: number },
    canon?: string,
    description: string,
    speedpaint_video_id?: string,
};

export function get_date_string(image: Model | ClientModel) {
    const date = new Date(image.date);
    const formatted_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formatted_date;
}

export type ClientModel = Omit<Model, "date"> & {
    next_image: string,
    prev_image: string,
    ordinal: number,
    date: string,
};

export type SingleImageRequest = {
    name?: string;
};

export type AllImagesRequest = Record<string, never>;