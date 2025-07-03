import * as Kysely from "kysely"

import * as ImageSchema from "./image"
import * as NewsSchema from "./news"
import * as PuzzleSchema from "./puzzle"
import * as RecordSchema from "./record"
import * as RuneSchema from "./rune"
import * as SketchSchema from "./sketch"

interface FileTable {
    id: Kysely.Generated<number>,
    data: Buffer,
    hash: string,
}

interface DirectoryTable {
    id: Kysely.Generated<number>,
    path: string,
    modified_ms: number,
}

export interface Database {
    file: FileTable,
    directory: DirectoryTable,
    image: ImageSchema.ImageTable,
    news: NewsSchema.NewsTable,
    news_item: NewsSchema.NewsItemTable,
    puzzle: PuzzleSchema.PuzzleTable,
    puzzle_linked_record: PuzzleSchema.PuzzleLinkedRecordTable,
    puzzle_solve: PuzzleSchema.PuzzleSolveTable,
    record: RecordSchema.RecordTable,
    record_line: RecordSchema.RecordLineTable,
    record_header_line: RecordSchema.RecordHeaderLineTable,
    rune: RuneSchema.RuneTable,
    runeword: RuneSchema.RunewordTable,
    runeword_rune: RuneSchema.RunewordRuneTable,
    sketch: SketchSchema.SketchTable,
}
