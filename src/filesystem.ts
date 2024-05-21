import * as Fs from "fs/promises";

export async function read_or_make(path: string, options: { default_: string }): Promise<string> {
    const default_ = options.default_ ?? "";
    const file_contents = await (async () => {
        try {
            return await Fs.readFile(path, { encoding: "utf8" });
        } catch (e) {
            // @ts-ignore
            if (e.code === "ENOENT") {
                await Fs.appendFile(path, default_, { encoding: "utf8" });
                return default_;
            }
            throw e;
        }
    })();
    return file_contents;
}

export async function ensure_dir(path: string): Promise<void> {
    await Fs.mkdir(path, { recursive: true });
}

export async function read(path: string): Promise<string> {
    const file_contents = await Fs.readFile(path, { encoding: "utf8" });
    return file_contents;
}

export async function replace(path: string, contents: string): Promise<void> {
    await Fs.writeFile(path, contents);
}

export type DirEntry = { name: string, type: "File" | "Directory" };
export async function enumerate(path: string): Promise<Array<DirEntry>> {
    const entries = await Fs.readdir(path, { withFileTypes: true });
    return entries.map(entry => ({ name: entry.name, type: entry.isFile() ? "File" : "Directory" }));
}

export async function exists(path: string): Promise<boolean> {
    try {
        await Fs.stat(path);
        return true;
    } catch (e) {
        // @ts-ignore
        if (e.code === "ENOENT") {
            return false;
        }
        throw e;
    }
}