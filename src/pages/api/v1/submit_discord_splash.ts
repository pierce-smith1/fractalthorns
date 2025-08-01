import * as SplashQueries from "../../../queries/splash"
import * as Endpoint from "../../../endpoint";

export const POST = Endpoint.make_handler<"submit_discord_splash">("submit_discord_splash", async (request, override) => {
    const max_splash_length = 80;

    console.log({request});

    if (request.text.length > max_splash_length) {
        return override(new Response(null, {status: 400}));
    }

    const result = await SplashQueries.queue_discord_splash(request);

    if (result.status === "rate-limited") {
        return override(new Response(null, {
            status: 429,
            headers: {"Retry-After": `${Math.ceil(result.retry_after_ms / 1000)}`},
        }));
    }

    return {};
});
