import Db from "../db";
import * as Directory from "../directory/directory";

export async function repopulate() {
    await Db
        .deleteFrom("directory")
        .execute();

    const fs_directory = await Directory.load_fs_directory();

    return Db
        .insertInto("directory")
        .values(fs_directory)
        .execute()
        .then(() => console.log("Updated directory. Have a nice day."));
}
