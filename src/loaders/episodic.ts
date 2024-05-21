import Config from "../config";
import * as Episodic from "../descriptors/episodic";
import * as Filesystem from "../filesystem";

export async function get(): Promise<Episodic.Model> {
    const story_file_path = `${Config.authorland_root}/records/story.json`;
    const solved_records_file_path = `${Config.readerland_root}/story/solved.json`;
    
    const story: Episodic.Model = {records: []};

    const raw_story_data = await Filesystem.read(story_file_path) 
    const story_data = JSON.parse(raw_story_data) as Array<{chapter_name: string, records: Array<[string, string]>}>;

    const solved_records_file_contents = await Filesystem.read(solved_records_file_path);
    const solved_records = JSON.parse(solved_records_file_contents) as Array<string>;

    for (const chapter of story_data) {
        const records = chapter.records.map(([iteration, name]) => ({ 
            name: name.replaceAll(" ", "-"), 
            title: name,
            chapter: chapter.chapter_name, 
            //solved: solved_records.includes(name),
            solved: true,
            iteration,
        }));         
        story.records = story.records.concat(records);
    }

    return story;
}

export type RecordEntriesByChapter = Array<{chapter: string, records: Array<Episodic.RecordEntry>}>
export async function get_by_chapter(): Promise<RecordEntriesByChapter> {
    const story_file_path = `${Config.authorland_root}/records/story.json`;
    const solved_records_file_path = `${Config.readerland_root}/story/solved.json`;

    const raw_story_data = await Filesystem.read(story_file_path) 
    const story_data = JSON.parse(raw_story_data) as Array<{chapter_name: string, records: Array<[string, string]>}>;

    const solved_records_file_contents = await Filesystem.read(solved_records_file_path);
    const solved_records = JSON.parse(solved_records_file_contents) as Array<string>;

    const episodic = story_data.map(chapter => ({
        chapter: chapter.chapter_name,
        records: chapter.records.map(([iteration, name]) => ({
            name: name.replaceAll(" ", "-"),
            title: name,
            chapter: chapter.chapter_name,
            iteration,
            //solved: solved_records.includes(record[1]),
            solved: true,
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