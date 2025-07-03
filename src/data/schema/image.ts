import * as Kysely from "kysely"

export interface ImageTable {
    id: Kysely.Generated<number>,
    name: string,
    title: string,
    date: string,
    canon: string | null,
    speedpaint_url: string | null,
    ordinal: number,
    file_id: number,
    thumbnail_file_id: number,
    description: string | null,
    characters: string | null,
    primary_color: string | null,
    secondary_color: string | null,
}
