import * as Kysely from "kysely"

export interface NewsTable {
    id: Kysely.Generated<number>,
    title: string,
    date: string,
    version: string | null,
}

export interface NewsItemTable {
    id: Kysely.Generated<number>,
    news_id: number,
    text: string,
}
