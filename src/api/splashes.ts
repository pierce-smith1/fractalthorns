import * as Interfaces from "../interfaces"

export const splash_object_schema = {
    text: {
        type: Interfaces.fields.required_string,
        description: "The text of the splash. This is raw text exactly as was originally submitted. On the site itself the splash may be transformed slightly, for instance to make it lowercase - this field holds the original unmodified text.",
    },
    ordinal: {
        type: Interfaces.fields.required_number,
        description: "A unique number ordering splashes from oldest to newest. The most recent splash has the highest ordinal, and the earliest has the lowest.",
    }
} as const;

export const paged_splash_request_schema = {
    page: {
        type: Interfaces.fields.required_number,
        description: "The 1-indexed page to retrieve. Pages are at most 20 splashes long and are sorted by descending submission order, e.g. requesting page 1 will give the 20 most recent splashes. If the page is out of range - for example, if there are only 30 splashes but page 3 is requested - an empty page will be returned.",
    },
};

export const paged_splash_response_schema = {
    splashes: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(splash_object_schema)),
        description: "A list of at most 20 splashes, sorted by descending submission order (latest to earliest). Will be empty if the page requested is out of range.",
    },
    current: {
        type: Interfaces.fields.optional_number,
        description: "The ordinal of the splash that is currently being displayed on the site. Not present if the current splash is not included in the `splashes` array because it is on a different page.",
    },
    page: {
        type: Interfaces.fields.required_number,
        description: "The number of the page that was requested.",
    }
} as const;

export const discord_splash_upload_request = {
    text: {
        type: Interfaces.fields.required_string,
        description: "The text of the splash. This may not be longer than 80 characters; if so, the request will fail with a 400."
    },
    submitter_display_name: {
        type: Interfaces.fields.required_string,
        description: "The current display name of the Discord user that asked to submit this splash."
    },
    submitter_user_id: {
        type: Interfaces.fields.required_string,
        description: "The user id of the Discord user that asked to submit this splash.",
    }
} as const;

export type SplashObject = Interfaces.TypeFromSchema<typeof splash_object_schema>;
export type PahedSplashRequest = Interfaces.TypeFromSchema<typeof paged_splash_request_schema>;
export type PagedSplashResponse = Interfaces.TypeFromSchema<typeof paged_splash_response_schema>;
export type DiscordSplashUploadRequest = Interfaces.TypeFromSchema<typeof discord_splash_upload_request>;
