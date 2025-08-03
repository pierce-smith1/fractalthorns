import type {APIRoute} from 'astro'

import * as SketchQueries from "../../../queries/sketch"

export const GET: APIRoute = async context => {
    const {name} = context.params;
    if (!name) {
        return new Response(null, {status: 400});
    }

    const data = await SketchQueries.get_data(name);
    if (!data) {
        return new Response(null, {status: 404});
    }

    const response = new Response(new Uint8Array(data), {headers: {"Content-Type": "image/png"}});
    return response;
};

