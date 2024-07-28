import * as Store from "svelte/store";

import * as PrivateDomain from "../../descriptors/domain";
import * as Domain from "../../descriptors/public/domain";
import * as Fetchers from "../../fetchers";
import * as Subproject from "../../descriptors/subproject";

export type NavItemFilter = {name: string, fn: (item: PrivateDomain.Item) => boolean};

export type NavState = {
    nav_results: Array<PrivateDomain.Item>,
    search_results: Array<PrivateDomain.Item>,
    search_term: string,
    item_filters: Array<NavItemFilter>,
    search_waiting: boolean,
    viewing_search_results: boolean,
};

export const nav_state = Store.writable<NavState>({
    nav_results: [],
    search_results: [],
    search_term: "",
    item_filters: [],
    search_waiting: false,
    viewing_search_results: false,
});

export function register_filter(filter: NavItemFilter) {
    nav_state.update(state => ({...state, item_filters: [...state.item_filters, filter]}));
}

export function unregister_filter(name: string) {
    nav_state.update(state => ({...state, item_filters: state.item_filters.filter(filter => filter.name !== name)}));
}

export function set_domain_items(domain: PrivateDomain.Domain) {
    const new_items_promise: Promise<Array<PrivateDomain.Item>> = (async () => {
        switch (domain) {
            case "image":
                const {images} = await Fetchers.get.all_images({});
                return images.map(image => ({domain, image}));

            case "episodic":
                const {chapters} = await Fetchers.get.full_episodic({});
                return chapters.flatMap(chapter => chapter.records.map(record => ({
                    domain: "episodic-item",
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

    function update_search_items(results: Array<Domain.DomainSearchResult>) {
        nav_state.update(state => ({...state, 
            search_results: PrivateDomain.sort_items([...state.search_results, ...results.map(PrivateDomain.result_to_item)])
        }));
    }

    image_results.then(({results}) => update_search_items(results));
    record_results.then(({results}) => update_search_items(results));
    line_results.then(({results}) => update_search_items(results));

    Promise.all([image_results, record_results, line_results]).then(_ => {
        nav_state.update(state => ({...state,
            search_waiting: false,
            viewing_search_results: true,
        }));
    });
}