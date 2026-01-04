import * as Interfaces from "../interfaces"
import * as DomainApi from "./domain"
import * as EpisodicApi from "./episodic"
import * as ImageApi from "./images"
import * as NewsApi from "./news"
import * as PuzzleApi from "./puzzles"
import * as SketchApi from "./sketches"
import * as SplashApi from "./splashes"
import * as TaleApi from "./tales"

export const endpoints = {
    all_news: NewsApi.all_news_endpoint,
    single_image: ImageApi.single_image_endpoint,
    image_description: ImageApi.image_description_endpoint,
    all_images: ImageApi.all_images_endpoint,
    single_sketch: SketchApi.single_sketch_endpoint,
    all_sketches: SketchApi.all_sketches_endpoint,
    full_episodic: EpisodicApi.full_episodic_endpoint,
    single_record: EpisodicApi.single_record_endpoint,
    record_text: EpisodicApi.record_text_endpoint,
    domain_search: DomainApi.domain_search_endpoint,
    all_puzzles: PuzzleApi.all_puzzles_endpoint,
    single_puzzle: PuzzleApi.single_puzzle_endpoint,
    solve_puzzle: PuzzleApi.solve_puzzle_endpoint,
    current_splash: SplashApi.current_splash_request_endpoint,
    paged_splashes: SplashApi.paged_splash_request_endpoint,
    submit_discord_splash: SplashApi.discord_splash_upload_endpoint,
    all_tales: TaleApi.all_tales_endpoint,
} as const;

export type GetEndpoints = {[endpoint in keyof typeof endpoints]: {
    request: Interfaces.TypeFromSchema<typeof endpoints[endpoint]["request"]>,
    response: Interfaces.TypeFromSchema<typeof endpoints[endpoint]["response"]>,
}};

export * from "./news"
export * from "./images"
export * from "./sketches"
export * from "./episodic"
export * from "./domain"
export * from "./puzzles"
export * from "./splashes"
export * from "./tales"
