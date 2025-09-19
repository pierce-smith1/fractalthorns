import * as Kysely from "kysely"

export interface SketchTable {
    id: Kysely.Generated<number>,
    name: string,
    ordinal: number,
    file_id: number,
    thumbnail_file_id: number,
    characters: string | null,
    primary_color: string | null,
    secondary_color: string | null,
    remarks: string | null,
}
