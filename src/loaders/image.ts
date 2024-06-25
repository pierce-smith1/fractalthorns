import Config from "../config";

import * as Filesystem from "../filesystem";
import * as Image from "../descriptors/image";

export type Model = Image.Model;

export async function get(name: string): Promise<Model | undefined> {
    const info_path = `${Config.authorland_root}/images/${name}/info.json`;
    const descr_path = `${Config.authorland_root}/images/${name}/descr.md`;

    if (!await Filesystem.exists(info_path)) {
        return undefined;
    }

    const info_file_contents = await Filesystem.read(info_path);
    const descr_file_contents = await Filesystem.exists(descr_path) ? await Filesystem.read(descr_path) : undefined;

    const model = JSON.parse(info_file_contents) as Model;
    const final_model = {...model,
        name,
        date: new Date(model.date),
        image_url: `/serve/image/${name}`,
        thumb_url: `/serve/thumb/${name}`,
        description: descr_file_contents,
    };

    return final_model;
}

export async function get_latest(): Promise<Model | undefined> {
    const images_root_path = `${Config.authorland_root}/images`;

    const image_entries = await Filesystem.enumerate(images_root_path);

    const latest = await get(image_entries[0].name);
    return latest;
}

export async function get_all(): Promise<Array<Model>> {
    const images_root_path = `${Config.authorland_root}/images`;

    const image_entries = await Filesystem.enumerate(images_root_path);

    const images = await Promise.all(image_entries.map(async entry => (await get(entry.name))!));
    const images_ordered_by_date = images.toSorted((a, b) => b.date.valueOf() - a.date.valueOf());

    return images_ordered_by_date;
}
