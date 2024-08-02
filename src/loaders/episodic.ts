import Config from "../config";
import * as Episodic from "../descriptors/episodic";
import * as Filesystem from "../filesystem";

export async function get(): Promise<Episodic.Model> {
    const story_file_path = `${Config.authorland_root}/records/story.json`;
    const solved_records_file_path = `${Config.readerland_root}/story/solved.json`;
    
    const solved_records_content = await Filesystem.read(solved_records_file_path);
    const solved_records = JSON.parse(solved_records_content) as Array<string>; 

    const story_file_contents = await Filesystem.read(story_file_path);
    const story_chapters = JSON.parse(story_file_contents) as Array<{chapter_name: string, records: Array<[string, string]>}>;
    const story_records = story_chapters.flatMap(chapter => chapter.records.map(([iteration, title]) => ({
        name: title.replaceAll(" ", "-"),
        title,
        chapter: chapter.chapter_name,
        solved: solved_records.includes(title),
        iteration,
    })));
    const episodic = {records: story_records};

    return episodic;
}

export type RecordEntriesByChapter = Array<{chapter: string, records: Array<Episodic.RecordEntry>}>
export async function get_by_chapter(): Promise<RecordEntriesByChapter> {
    const story_file_path = `${Config.authorland_root}/records/story.json`;
    const solved_records_file_path = `${Config.readerland_root}/story/solved.json`;
    
    const solved_records_content = await Filesystem.read(solved_records_file_path);
    const solved_records = JSON.parse(solved_records_content) as Array<string>; 

    const story_file_contents = await Filesystem.read(story_file_path);
    const story_chapters = JSON.parse(story_file_contents) as Array<{chapter_name: string, records: Array<[string, string]>}>;
    const episodic = story_chapters.map(chapter => ({
        chapter: chapter.chapter_name,
        records: chapter.records.map(([iteration, title]) => ({
            name: title.replaceAll(" ", "-"),
            title,
            chapter: chapter.chapter_name,
            solved: solved_records.includes(title),
            iteration,
        })),
    }));

    return episodic;
}

export async function solve(name: string, chapter: string): Promise<boolean> {
    const record_file_path = `${Config.authorland_root}/records/chapter_${chapter}/${name}.txt`;
    const solved_records_file_path = `${Config.readerland_root}/story/solved.json`;

    const record_exists = await Filesystem.exists(record_file_path);
    if (!record_exists) {
        return false;
    }

    // TODO race condition, needs proper file locking
    const solved_records_file_contents = await Filesystem.read(solved_records_file_path);
    const solved_records = JSON.parse(solved_records_file_contents) as Array<string>;
    
    solved_records.push(name);

    await Filesystem.replace(solved_records_file_path, JSON.stringify(solved_records, null, 4));

    return true;
}