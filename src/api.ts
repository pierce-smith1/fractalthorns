import * as Character from "./descriptors/character";
import * as News from "./descriptors/news";
import * as Domain from "./descriptors/domain";
import * as Episodic from "./descriptors/episodic";
import * as Record from "./descriptors/record";
import * as Image from "./descriptors/image";
import * as Splash from "./descriptors/splash";

export type GetEndpoints = {
    all_news: {
        request: News.AllNewsRequest,
        response: Array<News.ClientModel>,
    },
    all_images: {
        request: Image.AllImagesRequest,
        response: Array<Image.ClientModel>,
    },
    full_episodic: {
        request: Episodic.FullEpisodicRequest,
        response: Episodic.ClientModel,
    },
    single_character: {
        request: Character.SingleCharacterRequest,
        response: Character.Model,
    },
    single_image: {
        request: Image.SingleImageRequest,
        response: Image.ClientModel,     
    },
    single_record: {
        request: Episodic.SingleRecordRequest,
        response: Episodic.RedactableRecordEntry,
    },
    record_text: {
        request: Record.RecordTextRequest,
        response: Record.Model,
    },
    domain_search: {
        request: Domain.DomainSearchRequest,
        response: Domain.Page,
    },
};

export type PostEndpoints = {
    solve_episodic: {
        request: Episodic.SolveRecordRequest,
    },
    submit_splash: {
        request: Splash.UploadRequest,
    },
}