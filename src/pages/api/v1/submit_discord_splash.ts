import * as SplashQueries from "../../../queries/splash"
import * as Endpoint from "../../../endpoint";

import * as EmoteHelpers from "../../../helpers/emotes"

export const POST = Endpoint.make_handler<"submit_discord_splash">("submit_discord_splash", async (request, override) => {
    const max_splash_length = 80;

    // Check for disallowed characters
    if (/\p{Cc}/gu.test(request.text)) {
        return override(new Response(null, {status: 400}));
    }

    const splash_chunks = EmoteHelpers.parse_discord_emotes(request.text);

    if (EmoteHelpers.collapsed_length(splash_chunks) > max_splash_length) {
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
