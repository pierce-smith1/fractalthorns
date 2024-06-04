import * as Store from "svelte/store";

import * as Domain from "../../descriptors/domain";
import * as Fetchers from "../../fetchers";
import * as Subproject from "../../descriptors/subproject";

export type NavItem = Domain.Item & {hide?: boolean};
export type NavState = {
    nav_results: Array<NavItem>,
    search_results: Array<NavItem>,
    search_waiting: boolean,
    viewing_search_results: boolean,
};

export const nav_state = Store.writable<NavState>({
    nav_results: [],
    search_results: [],
    search_waiting: false,
    viewing_search_results: false,
});

export function set_domain_items(domain: Domain.Page["domain"]) {
    const new_items_promise: Promise<Array<Domain.Item>> = (async () => {
        switch (domain) {
            case "image":
                const images = await Fetchers.get.all_images({});
                return images.map(image => ({domain, name: image.name, image}));

            case "episodic":
                const episodic = await Fetchers.get.full_episodic({});
                return episodic.flatMap(chapter => chapter.records.map(record => ({
                    domain,
                    record_name: record.name,
                    record
                })));

            case "subproject": return Promise.resolve(Subproject.subprojects.map(subproject => ({domain, name: subproject.name})));
        }
        return Promise.resolve([]);
    })();

    new_items_promise.then(items => nav_state.update(state => ({...state, nav_results: items})));
}