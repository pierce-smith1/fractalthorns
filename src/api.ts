import * as PublicImage from "./descriptors/public/image";
import * as PublicEpisodic from "./descriptors/public/episodic";
import * as PublicRecord from "./descriptors/public/record";
import * as PublicDomain from "./descriptors/public/domain";
import * as PublicNews from "./descriptors/public/news";
import * as Interfaces from "./interfaces";

const all_news_endpoint = {
    request: PublicNews.all_news_request,
    response: {
        items: {
            type: Interfaces.fields.required_array(Interfaces.fields.required_object(PublicNews.all_news_response)),
            description: "A list of the news items, ordered from newest to oldest",
        },
    },
} as const;

const single_image_endpoint = {
    request: PublicImage.single_image_request,
    response: PublicImage.image_response,
} as const;

const all_images_endpoint = {
    request: PublicImage.all_images_request,
    response: {
        images: {
            type: Interfaces.fields.required_array(Interfaces.fields.required_object(PublicImage.image_response)),
            description: "A list of every image, sorted newest to oldest"
        },
    },
} as const;

const full_episodic_endpoint = {
    request: PublicEpisodic.full_episodic_request,
    response: {
        chapters: {
            type: Interfaces.fields.required_array(Interfaces.fields.required_object(PublicEpisodic.chapter_entry)),
            description: "A list of the chapters currently in the story, ordered by release time",
        },
    },
} as const;

const single_record_endpoint = {
    request: PublicEpisodic.single_record_request,
    response: PublicEpisodic.redactable_record_entry,
} as const;

const record_text_endpoint = {
    request: single_record_endpoint.request,
    response: PublicRecord.record_text_response,
} as const;

const domain_search_endpoint = {
    request: PublicDomain.domain_search_request,
    response: {
        results: {
            type: Interfaces.fields.required_array(Interfaces.fields.required_object(PublicDomain.domain_search_result)),
            description: "A list of the results the search found, in no particular order",
        },
    },
};

export const endpoints = {
    all_news: all_news_endpoint,
    single_image: single_image_endpoint,
    all_images: all_images_endpoint,
    full_episodic: full_episodic_endpoint,
    single_record: single_record_endpoint,
    record_text: record_text_endpoint,
    domain_search: domain_search_endpoint,
} as const;

export type GetEndpoints = {[endpoint in keyof typeof endpoints]: {
    request: Interfaces.ModelFromInterface<typeof endpoints[endpoint]["request"]>,
    response: Interfaces.ModelFromInterface<typeof endpoints[endpoint]["response"]>,
}};

let x = {} as GetEndpoints;
