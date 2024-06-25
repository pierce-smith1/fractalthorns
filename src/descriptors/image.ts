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
};

export function get_date_string(image_date: string | Date) {
    const date = new Date(image_date);
    const formatted_date = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    return formatted_date;
}

export function speedpaint_id_to_url(id: string) {
    return `https://youtube.com/watch?v=${id}`;
}