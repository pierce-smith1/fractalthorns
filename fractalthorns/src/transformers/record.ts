import * as Records from "../loaders/record";
import * as Api from "../api";

export function to_redactable_entry(record: Records.Record): Api.RedactableRecordEntry {
    const entry = {
        name: record.solved ? record.name : undefined,
        title: record.solved ? record.title : undefined,
        iteration: record.solved ? record.iteration : undefined,
        solved: record.solved,
        chapter: record.chapter,
    };

    return entry;
}

export function to_record_text(record: Records.Record): Api.RecordTextResponse {
    const text = {
        format: record.options["fmt"],
        requested: record.requested,
        iteration: record.iteration,
        header_lines: record.header_lines,
        languages: record.languages,
        characters: record.characters,
        lines: record.lines,
    };

    return text;
}

export function to_chapter_entries(records: Array<Records.Record>): Array<Api.ChapterEntry> {
    const chapters = records.reduce((chapters, record) => {
        const chapter = chapters.find(chapter => chapter.name === record.chapter);
        if (chapter) {
            chapter.records.push(to_redactable_entry(record));
        } else {
            chapters.push({name: record.chapter, records: [to_redactable_entry(record)]});
        }
        return chapters;
    }, [] as Array<Api.ChapterEntry>);

    return chapters;
}