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