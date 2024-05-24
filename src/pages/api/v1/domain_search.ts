import * as DomainSearch from "../../../actions/domainsearch";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"domain_search">(async (request, override) => {
    const {term, type} = request;
    const pages = DomainSearch.find_items(term, type);
    return pages;
});
