import * as Kysely from "kysely"
import BetterSqlite3 from "better-sqlite3"

import Config from "../config";
import * as Schema from "./schema/schema";

// The external tool we use for DB migrations, dbmate, wants to have the
// DATABASE_URL set to a format like "schema:url".
// Kysely just wants the URL part.
const database_file = Config.database_url.split(":")[1];

export default new Kysely.Kysely<Schema.Database>({
    dialect: new Kysely.SqliteDialect({
        database: new BetterSqlite3(database_file),
    }),
    log: ["query"],
});
