import * as Interfaces from "../../interfaces";

export const all_news_request = {} as const;
export type AllNewsRequest = Interfaces.ModelFromInterface<typeof all_news_request>;

export const all_news_response = {
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
export type AllNewsResponse = Interfaces.ModelFromInterface<typeof all_news_response>;