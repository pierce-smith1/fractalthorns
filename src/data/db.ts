import * as Kysely from "kysely"
import BetterSqlite3 from "better-sqlite3"

import Config from "../config";
import * as Schema from "./schema/schema";

export default new Kysely.Kysely<Schema.Database>({
    dialect: new Kysely.SqliteDialect({
        database: new BetterSqlite3(Config.database_file),
    }),
    log: ["query"],
});
