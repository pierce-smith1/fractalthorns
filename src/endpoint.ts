import * as Api from "./api/api"
import * as ApiKeyQueries from "./queries/api_key"

const api_key_header = "X-Fractalthorns-Api-Key";

export function get_parameters(request: Request) {
    const url_parts = request.url.split("?");
    if (url_parts.length <= 1) {
        return {};
    }

    const search_params = new URLSearchParams(url_parts.slice(1).join(""));

    const params_object = JSON.parse(search_params.get("body") ?? "{}");
    return params_object;
}

export function make_handler<
    EndpointName extends keyof Api.GetEndpoints, 
    Params = Api.GetEndpoints[EndpointName]["request"], 
    Model = Api.GetEndpoints[EndpointName]["response"]
>(
    endpoint_name: EndpointName,
    loader: (request: Params, override_response: (new_response: Response) => Model) => Promise<Model>
): ({request}: {request: Request}) => Promise<Response> {
    return async ({request}: {request: Request}) => {
        const endpoint_is_protected = (Api.endpoints[endpoint_name] as any).protected;
        if (endpoint_is_protected) {
            const api_key = request.headers.get(api_key_header);
            const key_lookup_result = api_key && await ApiKeyQueries.key_is_valid(api_key);

            if (!key_lookup_result) {
                return new Response(null, {status: 401});
            }
        }

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
