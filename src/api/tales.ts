import * as Interfaces from "../interfaces"

export const tale_entry_schema = {
    name: {
        type: Interfaces.fields.required_string,
        description: "The identifying name of this tale."
    },
    title: {
        type: Interfaces.fields.required_string,
        description: "The display title of this tale."
    },
    canon: {
        type: Interfaces.fields.optional_string,
        description: "The canon designation for the world that this image depicts. Not applicable if no relevant canon designation exists.",
    },
    page_url: {
        type: Interfaces.fields.required_string,
        description: "The URL (relative to the root of the server) from which an HTML document containing the tale can be retrieved.",
    },
    date: {
        type: Interfaces.fields.required_string,
        description: "The date this tale was released in ISO 8601 YYYY-MM-DD format.",
    },
} as const;

export const all_tales_endpoint = {
    description: "Get information about all available tales. Compared to records, tales are longer (10,000+ words), more isolated stories that are made to be read on their own.",
    request: {},
    response: {
        tales: {
            type: Interfaces.fields.required_array(Interfaces.fields.required_object(tale_entry_schema)),
            description: "A list of all available tales, sorted by release date.",
        }
    }
} as const;

export type TaleEntry = Interfaces.TypeFromSchema<typeof tale_entry_schema>;
