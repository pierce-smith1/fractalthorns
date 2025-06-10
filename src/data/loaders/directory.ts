import * as Exp from "drizzle-orm/sqlite-core/expressions";
import sharp from "sharp";

import Config from "../../config";
import * as Filesystem from "../../filesystem";
import Db from "../db";
import * as Schema from "../schema/schema";
import * as LoaderUtil from "./util";
import * as Directory from "../directory/directory";

export async function repopulate() {
    await Db.delete(Schema.directory);

    const fs_directory = await Directory.load_fs_directory();

    Db.insert(Schema.directory).values(fs_directory)
        .then(() => console.log("Updated directory. Have a nice day."));
}