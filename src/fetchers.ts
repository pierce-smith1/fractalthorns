import * as Api from "./api";

// REDIS HATES HIM
const fetch_cache: {[key: string]: any} = {};

function define_get_fetcher<
    EndpointName extends keyof Api.GetEndpoints, 
    Params = Api.GetEndpoints[EndpointName]["request"], 
    Result = Api.GetEndpoints[EndpointName]["response"]
>(endpoint: EndpointName): (request: Params) => Promise<Result> {
    return (request: Params) => {
        const body = JSON.stringify(request);
        const url = `/api/v1/${endpoint}?body=${body}`;

        if (url in fetch_cache) {
            return fetch_cache[url];
        }

        const results = fetch(`/api/v1/${endpoint}?body=${body}`)
            .then(response => response.json())
            .then(response => response as Result);

        fetch_cache[url] = results;
        return results;
    }
}

export const get = {
    all_news: define_get_fetcher<"all_news">("all_news"),
    all_images: define_get_fetcher<"all_images">("all_images"),
    full_episodic: define_get_fetcher<"full_episodic">("full_episodic"),
    single_character: define_get_fetcher<"single_character">("single_character"),
    single_image: define_get_fetcher<"single_image">("single_image"),
    single_record: define_get_fetcher<"single_record">("single_record"),
    record_text: define_get_fetcher<"record_text">("record_text"),
    domain_search: define_get_fetcher<"domain_search">("domain_search"),
};
