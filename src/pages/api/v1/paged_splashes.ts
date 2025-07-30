import * as SplashQueries from "../../../queries/splash"
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"paged_splashes">(async (request, _override) => {
    const splashes = await SplashQueries.get_paged(request.page);
    return {splashes, page: request.page};
});
