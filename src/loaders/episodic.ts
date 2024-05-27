import Config from "../config";
import * as Episodic from "../descriptors/episodic";
import * as Filesystem from "../filesystem";
import * as GenericUtil from "../genericutil";

export async function get(): Promise<Episodic.Model> {
    const story_file_path = `${Config.authorland_root}/records/story.json`;
    const solved_records_file_path = `${Config.readerland_root}/story/solved.json`;
    
    const story: Episodic.Model = {records: []};

    const raw_story_data = await Filesystem.read(story_file_path) 
    const story_data = JSON.parse(raw_story_data) as Array<{chapter_name: string, records: Array<[string, string]>}>;
    const flat_story_data = story_data.flatMap(chapter => chapter.records);

    const solved_records_file_contents = await Filesystem.read(solved_records_file_path);
    const solved_records = JSON.parse(solved_records_file_contents) as Array<string>;

    for (const chapter of story_data) {
        const records = chapter.records.map(([iteration, name]) => { 
            const this_record_index = flat_story_data.findIndex(([iteration, other_name]) => name === other_name);
            const [prev_record, next_record] = GenericUtil.neighbors(this_record_index, flat_story_data);
            return {
                name: name.replaceAll(" ", "-"), 
                title: name,
                chapter: chapter.chapter_name, 
                solved: solved_records.includes(name),
                iteration,
                next_record: next_record[1].replaceAll(" ", "-"),
                prev_record: prev_record[1].replaceAll(" ", "-")
            };
        });         
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
    const flat_story_data = story_data.flatMap(chapter => chapter.records);

    const solved_records_file_contents = await Filesystem.read(solved_records_file_path);
    const solved_records = JSON.parse(solved_records_file_contents) as Array<string>;

    const episodic = story_data.map(chapter => ({
        chapter: chapter.chapter_name,
        records: chapter.records.map(([iteration, name]) => {
            const this_record_index = flat_story_data.findIndex(([iteration, other_name]) => name === other_name);
            const [prev_record, next_record] = GenericUtil.neighbors(this_record_index, flat_story_data);
            return {
                name: name.replaceAll(" ", "-"), 
                title: name,
                chapter: chapter.chapter_name, 
                solved: solved_records.includes(name),
                iteration,
                next_record: next_record[1].replaceAll(" ", "-"),
                prev_record: prev_record[1].replaceAll(" ", "-")
            };
        }),
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