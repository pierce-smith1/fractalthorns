import * as CharacterLoader from "../../../loaders/character";
import * as Endpoint from "../../../endpoint";

export const GET = Endpoint.use_get_handler<"single_character">(async (request, override) => {
    const character = await CharacterLoader.get(request.name);

    if (!character) {
        return override(new Response(null, {status: 404}));
    }

    return character;
});
