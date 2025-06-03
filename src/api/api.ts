import * as Interfaces from "../interfaces";
import * as DomainApi from "./domain";
import * as EpisodicApi from "./episodic";
import * as ImageApi from "./images";
import * as NewsApi from "./news";
import * as PuzzleApi from "./puzzles";
import * as SketchApi from "./sketches";

export const endpoints = {
    all_news: NewsApi.all_news_endpoint,
    single_image: ImageApi.single_image_endpoint,
    image_description: ImageApi.image_description_endpoint,
    all_images: ImageApi.all_images_endpoint,
    all_sketches: SketchApi.all_sketches_endpoint,
    full_episodic: EpisodicApi.full_episodic_endpoint,
    single_record: EpisodicApi.single_record_endpoint,
    record_text: EpisodicApi.record_text_endpoint,
    domain_search: DomainApi.domain_search_endpoint,
    all_puzzles: PuzzleApi.all_puzzles_endpoint,
    single_puzzle: PuzzleApi.single_puzzle_endpoint,
    solve_puzzle: PuzzleApi.solve_puzzle_endpoint,
} as const;

export type GetEndpoints = {[endpoint in keyof typeof endpoints]: {
    request: Interfaces.TypeFromSchema<typeof endpoints[endpoint]["request"]>,
    response: Interfaces.TypeFromSchema<typeof endpoints[endpoint]["response"]>,
}};

export * from "./news";
export * from "./images";
export * from "./sketches";
export * from "./episodic";
export * from "./domain";
export * from "./puzzles";