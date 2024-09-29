import * as Api from "./api";

export function get_parameters(request: Request) {
    const url_parts = request.url.split("?");
    if (url_parts.length <= 1) {
        return {};
    }

    const search_params = new URLSearchParams(url_parts[1]);
    const params_object = JSON.parse(search_params.get("body") ?? "{}");
    return params_object;
}

export function use_get_handler<
    EndpointName extends keyof Api.GetEndpoints, 
    Params = Api.GetEndpoints[EndpointName]["request"], 
    Model = Api.GetEndpoints[EndpointName]["response"]
>(loader: (request: Params, override_response: (new_response: Response) => Model) => Promise<Model>): ({request}: {request: Request}) => Promise<Response> {
    return async ({request}: {request: Request}) => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const url_params = get_parameters(request);
        const request_params = url_params as Params;

        let response_override: Response | undefined = undefined;
        const override_callback = (new_response: Response) => {
            response_override = new_response;
            return {} as Model;
        }

        const model = await loader(request_params, override_callback);

        if (response_override) {
            return response_override;
        }

        const response_payload = JSON.stringify(model);
        return new Response(response_payload, {status: 200, headers: {"Content-Type": "application/json"}});
    }
}