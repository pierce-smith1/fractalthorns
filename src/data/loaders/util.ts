import * as Exp from "drizzle-orm/sqlite-core/expressions";
import Crypto from "node:crypto";

import Db from "../db";
import * as Schema from "../schema/schema";

export async function ensure_file(data: Buffer): Promise<number> {
    // @ts-ignore I'm sure it's fine...
    const hash = Crypto.createHash("sha256").update(data).digest("hex");

    const [existing_file] = await Db.select().from(Schema.file)
        .where(Exp.eq(Schema.file.hash, hash));

    if (existing_file) {
        return existing_file.id;
    }

    const [new_file] = await Db.insert(Schema.file).values({
        data,
        hash,
    }).returning();

    return new_file.id;
}