import * as Kysely from "kysely"

export interface RecordTable {
    id: Kysely.Generated<number>,
    name: string,
    title: string,
    canon: string,
    chapter: string,
    ordinal: number,
    requested: number,
    languages: string,
    characters: string,
    format: string | null,
    always_discovered: number,
}

export interface RecordLineTable {
    id: Kysely.Generated<number>,
    record_id: number,
    type: number,
    character: string | null,
    language: string | null,
    emphasis: string | null,
    text: string,
    ordinal: number,
}

export interface RecordHeaderLineTable {
    id: Kysely.Generated<number>,
    record_id: number,
    text: string,
}
