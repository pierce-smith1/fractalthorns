import * as Interfaces from "../interfaces"

export const splash_object_schema = {
    text: {
        type: Interfaces.fields.required_string,
        description: "The text of the splash. This is raw text exactly as was originally submitted. On the site itself the splash may be transformed slightly, for instance to make it lowercase - this field holds the original unmodified text.",
    },
    ordinal: {
        type: Interfaces.fields.required_number,
        description: "A unique number ordering splashes from oldest to newest. The most recent displayed splash has the highest ordinal, and the earliest has the lowest.",
    },
} as const;

export const paged_splash_request_schema = {
    page: {
        type: Interfaces.fields.required_number,
        description: "The 1-indexed page to retrieve. Pages are at most 20 splashes long and are sorted by descending submission order, e.g. requesting page 1 will give the 20 most recent splashes. If the page is out of range - for example, if there are only 30 splashes but page 3 is requested - an empty page will be returned.",
    },
} as const;

export const paged_splash_response_schema = {
    splashes: {
        type: Interfaces.fields.required_array(Interfaces.fields.required_object(splash_object_schema)),
        description: "A list of at most 20 splashes, sorted by descending submission order (latest to earliest). Will be empty if the page requested is out of range. If page 1 is requested, the first splash in this list is the one currently being displayed on the site.",
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
        description: "The user id of the Discord user that asked to submit this splash. This will be used for the purposes of rate limiting.",
    }
} as const;

export const paged_splash_request_endpoint = {
    description: "Get the splashes that have been seen on the site. This includes ONLY splashes that have been or are being displayed - splashes that are in the splash queue are NOT included.",
    request: paged_splash_request_schema,
    response: paged_splash_response_schema,
} as const;

export const discord_splash_upload_endpoint = {
    method: "POST",
    protected: true,
    description: "Submit a splash that was created by a Discord user into the splash queue. Only one splash for a particular user can be submitted per 24 hours; if more than one is attempted, the request will fail with a 400.",
    request: discord_splash_upload_request,
    response: {},
} as const;

export type SplashObject = Interfaces.TypeFromSchema<typeof splash_object_schema>;
export type PahedSplashRequest = Interfaces.TypeFromSchema<typeof paged_splash_request_schema>;
export type PagedSplashResponse = Interfaces.TypeFromSchema<typeof paged_splash_response_schema>;
export type DiscordSplashUploadRequest = Interfaces.TypeFromSchema<typeof discord_splash_upload_request>;
