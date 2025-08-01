import * as Crypto from "node:crypto";

import Db from "../data/db"

export async function key_is_valid(key: string): Promise<boolean> {
    const database_key = await Db
        .selectFrom("api_key")
        .selectAll()
        .where("key", "=", key)
        .executeTakeFirst();

    return !!database_key;
}

export async function add_key(subject_name: string): Promise<string> {
    const new_key = Crypto.randomUUID();

    await Db
        .insertInto("api_key")
        .values({
            key: new_key,
            subject_name,
        })
        .execute();

    return new_key;
}
