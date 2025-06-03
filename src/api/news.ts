import * as Interfaces from "../interfaces";

export const news_item_schema = {
    title: {
        type: Interfaces.fields.required_string,
        description: "Some witty quip to use as the name of the update.",
    },
    items: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_string),
        description: "A list of changes made in this update.",
    },
    date: {
        type: Interfaces.fields.required_string,
        description: "The date the update was made in ISO 8601 format (YYYY-MM-DDTHH:mm:ss.sssZ).",
    },
    version: {
        type: Interfaces.fields.optional_string,
        description: "If this update should change the version string, the new version string to use - not present otherwise.",
    },
} as const;

export const all_news_response_schema = {
    items: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(news_item_schema)),
        description: "A list of the news items, ordered from newest to oldest.",
    }
} as const;

export const all_news_endpoint = {
    description: "Get the news items that show up on the front page. These are usually but not always site updates.",
    request: {},
    response: all_news_response_schema,
} as const;

export type NewsItem = Interfaces.TypeFromSchema<typeof news_item_schema>;
export type AllNewsRequest = {};
export type AllNewsResponse = Interfaces.TypeFromSchema<typeof all_news_response_schema>;
