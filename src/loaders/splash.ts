import * as Splash from "../descriptors/splash";
import * as Filesystem from "../filesystem";
import Config from "../config";

export async function get_latest(latest_n?: number) {
    const splash_dir_path = `${Config.readerland_root}/splash`;
    const splash_file_path = `${splash_dir_path}/splashes.json`;

    await Filesystem.ensure_dir(splash_dir_path);

    const splashes_file_contents = await Filesystem.read_or_make(splash_file_path, { default_: "[]" });

    let splashes_list = JSON.parse(splashes_file_contents) as Array<Splash.Model>;
    splashes_list = splashes_list.map(splash => ({ ...splash, submitted_on: new Date(splash.submitted_on) }));
    splashes_list = splashes_list.sort((a, b) => b.submitted_on.valueOf() - a.submitted_on.valueOf());

    const latest_splashes_list = latest_n ? 
          splashes_list.slice(-latest_n)
        : splashes_list;

    return latest_splashes_list;
}

export async function save(splash: Splash.Model) {
    const splash_dir_path = `${Config.readerland_root}/splash`;
    const splash_file_path = `${splash_dir_path}/splashes.json`;

    await Filesystem.ensure_dir(splash_dir_path);

    // TODO
    // There is a HUGE race condition problem here, and I fucking hate it, but node doesn't make this easy for me.
    // We really need proper file locking, which might have to come from a dependency.
    const splashes_file_contents = await Filesystem.read_or_make(splash_file_path, { default_: "[]" });

    let splashes_list = JSON.parse(splashes_file_contents) as Array<Splash.Model>;
    splashes_list.push(splash);

    const new_splashes_file_contents = JSON.stringify(splashes_list, null, 4);
    Filesystem.replace(splash_file_path, new_splashes_file_contents);
}