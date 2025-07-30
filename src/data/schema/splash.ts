import * as Kysely from "kysely"

export interface SplashTable {
    id: Kysely.Generated<number>,
    text: string,
    created_at: string,
    ordinal: number,
    source: string | null,
}

export interface SplashDiscordDetailTable {
    id: Kysely.Generated<number>,
    splash_id: number,
    display_name: string,
    user_id: string,
}

export interface SplashCursorTable {
    position: number,
    last_updated: string,
}
