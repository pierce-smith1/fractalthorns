import * as Store from "svelte/store";

import * as Domain from "../../descriptors/domain";
import * as Fetchers from "../../fetchers";
import * as Subproject from "../../descriptors/subproject";
import * as Episodic from "../../descriptors/episodic";

export type NavItem = Domain.Item & {hide?: boolean};
export type NavState = {
    nav_results: Array<NavItem>,
    search_results: Array<NavItem>,
    search_term: string,
    iteration_filters: Set<Episodic.Iteration>,
    search_waiting: boolean,
    viewing_search_results: boolean,
};

export const nav_state = Store.writable<NavState>({
    nav_results: [],
    search_results: [],
    search_term: "",
    iteration_filters: new Set(),
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

export function execute_search(term: string) {
    term = term.trim();

    nav_state.update(state => ({...state,
        search_term: term,
    }));

    if (term.length === 0) {
        nav_state.update(state => ({...state,
            search_results: [],
            search_waiting: false,
            viewing_search_results: true,
        }));
        return;
    }

    const image_results = Fetchers.get.domain_search({term, type: "image"});
    const record_results = Fetchers.get.domain_search({term, type: "episodic-item"});
    const line_results = Fetchers.get.domain_search({term, type: "episodic-line"});

    nav_state.update(state => ({...state,
        search_results: [],
        search_waiting: true,
    }));

    function update_search_items(items: Array<Domain.Item>) {
        nav_state.update(state => ({...state, 
            search_results: Domain.sort_items([...state.search_results, ...items])
        }));
    }

    image_results.then(update_search_items);
    record_results.then(update_search_items);
    line_results.then(update_search_items);

    Promise.all([image_results, record_results, line_results]).then(_ => {
        nav_state.update(state => ({...state,
            search_waiting: false,
            viewing_search_results: true,
        }));
    });
}