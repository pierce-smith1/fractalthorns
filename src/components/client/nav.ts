import * as Store from "svelte/store";

import * as Domain from "../../descriptors/domain";
import * as Fetchers from "../../fetchers";
import * as Subproject from "../../descriptors/subproject";

export type NavItem = Domain.Item & {hide?: boolean};
export const current_items = Store.writable<Array<NavItem>>([]);

export function set_domain_items(domain: Domain.Page["domain"]) {
    const new_items_promise: Promise<Array<Domain.Item>> = (() => {
        switch (domain) {
            case "image": return Fetchers.get.all_images({})
                .then(images => images.map(image => ({domain, name: image.name, image})));

            case "episodic": return Fetchers.get.full_episodic({})
                .then(episodic => episodic.flatMap(chapter => chapter.records.map(record => ({domain, record_name: record.name, record}))));

            case "subproject": return Promise.resolve(Subproject.subprojects.map(subproject => ({domain, name: subproject.name})));
        }
        return Promise.resolve([]);
    })();

    new_items_promise.then(items => current_items.set(items));
}