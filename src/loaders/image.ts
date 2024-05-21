import Config from "../config";

import * as Filesystem from "../filesystem";
import * as Image from "../descriptors/image";

export type Model = Image.Model;

export async function get(name: string): Promise<Model> {
    const info_path = `${Config.authorland_root}/images/${name}/info.json`;
    const descr_path = `${Config.authorland_root}/images/${name}/descr.md`;

    const info_file_contents = await Filesystem.read(info_path);
    const descr_file_contents = await Filesystem.exists(descr_path) ? await Filesystem.read(descr_path) : undefined;

    let model = JSON.parse(info_file_contents) as Model;
    model = {...model, name};
    model = {...model, date: new Date(model.date)};
    model = {...model, image_url: `/serve/image/${name}`, thumb_url: `/serve/thumb/${name}`};
    model = {...model, description: descr_file_contents ?? "🛠 *something indistinct echoes from the future...* 🛠"};

    return model;
}

export async function get_all(): Promise<Array<Model>> {
    const images_root_path = `${Config.authorland_root}/images`;

    const image_entries = await Filesystem.enumerate(images_root_path);

    const images = await Promise.all(image_entries.map(async entry => (await get(entry.name))!));
    const images_ordered_by_date = images.toSorted((a, b) => b.date.valueOf() - a.date.valueOf());

    return images_ordered_by_date;
}
