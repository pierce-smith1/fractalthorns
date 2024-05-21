import Config from "../config";
import * as Filesystem from "../filesystem";

export type Model = {
    group: string,
    name: string,
    ordinal: number,
    type: "Image" | "Script",
    discovered: boolean,
};

export async function get_in_group(group: string): Promise<Array<Model>> {
    const group_dir = `${Config.authorland_root}/puzzles/${group}`;
    const discovered_file_path = `${Config.readerland_root}/puzzles/discovered.json`;

    const get_puzzle_file_basename = (filename: string) => filename.split(".")[1];
    const get_puzzle_file_ordinal = (filename: string) => parseInt(filename.split(".")[0]);
    const get_puzzle_file_type = (filename: string): Model["type"] => {
        switch (filename.split(".")[2]) {
            case "png": return "Image";
            case "js": return "Script";
            default: throw new Error(`Puzzle extension on ${filename} is unrecognized`);
        }
    };

    const discovered_file_contents = await Filesystem.read(discovered_file_path);
    const raw_discovered_puzzles = JSON.parse(discovered_file_contents) as Array<string>;
    const discovered_puzzles = raw_discovered_puzzles.map(path => ({ group: path.split("/")[0], name: path.split("/")[1] }));

    const puzzle_files = await Filesystem.enumerate(group_dir);
    const puzzles = puzzle_files.map(file => ({
        group,
        name: get_puzzle_file_basename(file.name),
        ordinal: get_puzzle_file_ordinal(file.name),
        type: get_puzzle_file_type(file.name),
        discovered: discovered_puzzles.some(puzzle => puzzle.group === group && puzzle.name === get_puzzle_file_basename(file.name))
    }));

    return puzzles;
}

export async function discover(group: string, name: string): Promise<boolean> {
    const puzzle_file_path = `${Config.authorland_root}/puzzles/${group}/${name}`;
    const discovered_file_path = `${Config.readerland_root}/puzzles/discovered.json`;

    const puzzle_file_did_exist = await Filesystem.exists(puzzle_file_path);
    if (!puzzle_file_did_exist) {
        return false;
    }

    // TODO race condition
    const discovered_file_contents = await Filesystem.read(discovered_file_path);
    const discovered_puzzles = JSON.parse(discovered_file_contents) as Array<string>;

    discovered_puzzles.push(`${group}/${name}`);

    await Filesystem.replace(discovered_file_path, JSON.stringify(discovered_puzzles, null, 4));

    return true;
}
