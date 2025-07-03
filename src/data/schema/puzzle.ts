import * as Kysely from "kysely"

export interface PuzzleTable {
    id: Kysely.Generated<number>,
    name: string,
    chapter: string,
    solve_behavior: string,
    solve_code: string,
    primary_color: string | null,
    secondary_color: string | null,
    type: string,
    ordinal: number,
}

export interface PuzzleLinkedRecordTable {
    id: Kysely.Generated<number>,
    puzzle_id: number,
    record_name: string,
}

export interface PuzzleSolveTable {
    id: Kysely.Generated<number>,
    puzzle_id: number,
    record_id: number,
}
