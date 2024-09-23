import * as DomainSearch from "../../../actions/domainsearch";
import * as Domain from "../../../helpers/domain";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"domain_search">(async (request, override) => {
    const {term, type} = request;
    const pages = await DomainSearch.find_items(term, type as Domain.SearchItemType);
    const results = pages.map(page => Domain.item_to_result(page));
    return {results};
});
