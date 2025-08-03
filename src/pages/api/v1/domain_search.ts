import * as DomainSearch from "../../../actions/domainsearch";
import * as Domain from "../../../helpers/domain";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"domain_search">("domain_search", async (request, _override) => {
    const {term, type} = request;
    const pages = await DomainSearch.find_items(term, type as Domain.SearchItemType);
    const results = pages.map(page => Domain.item_to_result(page));
    return {results};
});
