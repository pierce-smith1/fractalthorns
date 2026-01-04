import * as Api from "./api/api";

// REDIS HATES HIM
const fetch_cache: {[key: string]: any} = {};

function get_base_url_for_endpoint(endpoint: keyof Api.GetEndpoints) {
    const base_url = `/api/v1/${endpoint}`;
    return base_url;
}

function define_fetcher<
    EndpointName extends keyof Api.GetEndpoints,
    Params = Api.GetEndpoints[EndpointName]["request"],
    Result = Api.GetEndpoints[EndpointName]["response"]
>(endpoint: EndpointName, method: "GET" | "POST" = "GET"): (request: Params) => Promise<Result> {
    return (request: Params) => {
        const body = JSON.stringify(request);
        const url = `${get_base_url_for_endpoint(endpoint)}?body=${encodeURIComponent(body)}`;

        if (method === "GET" && url in fetch_cache) {
            return fetch_cache[url];
        }

        const results = fetch(url, {method})
            .then(response => response.json())
            .then(response => response as Result);

        if (method === "GET") {
            fetch_cache[url] = results;
        }
        return results;
    }
}

export function invalidate_cache(endpoint_name: keyof Api.GetEndpoints) {
    const base_url = get_base_url_for_endpoint(endpoint_name);
    for (const key in fetch_cache) {
        if (key.startsWith(base_url)) {
            delete fetch_cache[key];
        }
    }
}

export const get = {
    all_news: define_fetcher<"all_news">("all_news"),
    all_images: define_fetcher<"all_images">("all_images"),
    single_sketch: define_fetcher<"single_sketch">("single_sketch"),
    all_sketches: define_fetcher<"all_sketches">("all_sketches"),
    image_description: define_fetcher<"image_description">("image_description"),
    full_episodic: define_fetcher<"full_episodic">("full_episodic"),
    single_image: define_fetcher<"single_image">("single_image"),
    single_record: define_fetcher<"single_record">("single_record"),
    record_text: define_fetcher<"record_text">("record_text"),
    domain_search: define_fetcher<"domain_search">("domain_search"),
    all_puzzles: define_fetcher<"all_puzzles">("all_puzzles"),
    single_puzzle: define_fetcher<"single_puzzle">("single_puzzle"),
    current_splash: define_fetcher<"current_splash">("current_splash"),
    paged_splashes: define_fetcher<"paged_splashes">("paged_splashes"),
    all_tales: define_fetcher<"all_tales">("all_tales"),
};

export const post = {
    solve_puzzle: define_fetcher<"solve_puzzle">("solve_puzzle", "POST"),
};
