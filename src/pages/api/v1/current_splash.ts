import * as SplashQueries from "../../../queries/splash"
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.make_handler<"current_splash">(async (_request, _override) => {
    const splash = await SplashQueries.get_current();
    return {splash: splash ?? undefined};
});
