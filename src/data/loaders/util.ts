import Crypto from "node:crypto";

import Db from "../db";

export async function ensure_file(data: Buffer): Promise<number> {
    // @ts-ignore I'm sure it's fine...
    const hash = Crypto.createHash("sha256").update(data).digest("hex");

    const existing_file = await Db
        .selectFrom("file")
        .selectAll()
        .where("hash", "=", hash)
        .executeTakeFirst();

    if (existing_file) {
        return existing_file.id;
    }

    const new_file = await Db
        .insertInto("file")
        .values({
            data,
            hash,
        })
        .returningAll()
        .executeTakeFirstOrThrow();

    return new_file.id;
}
