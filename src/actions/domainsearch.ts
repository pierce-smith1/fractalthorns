import * as Domain from "../descriptors/domain";

import * as ImageLoader from "../loaders/image";
import * as EpisodicLoader from "../loaders/episodic";

export async function find_items(term: string): Promise<Array<Domain.Page>> {
    const results: Array<Domain.Page> = [];

    const images = await find_image_items(term);
    results.push(...images);

    const records = await find_episodic_items(term);
    results.push(...records);

    return results;
}

export async function find_image_items(term: string): Promise<Array<Domain.Page & {domain: "image"}>> {
    const images = await ImageLoader.get_all();
    const matching_images = images.filter(image => image.name.includes(term) || image.title.includes(term));
    const image_items = matching_images.map(image => ({domain: "image" as const, item: image.name}));
    return image_items;
}

export async function find_episodic_items(term: string): Promise<Array<Domain.Page & {domain: "episodic"}>> {
    const episodic = await EpisodicLoader.get();
    const matching_records = episodic.records.filter(record => record.solved && record.name.includes(term));
    const record_items = matching_records.map(record => ({domain: "episodic" as const, item: record.name}));
    return record_items;
}