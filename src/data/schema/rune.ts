import * as Kysely from "kysely"

export interface RuneTable {
    id: Kysely.Generated<number>,
    name: string,
    file_id: number,
}

export interface RunewordTable {
    id: Kysely.Generated<number>,
    name: string,
}

export interface RunewordRuneTable {
    id: Kysely.Generated<number>,
    rune_name: string,
    runeword_name: string,
    ordinal: number,
}
