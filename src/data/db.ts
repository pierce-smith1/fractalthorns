import Config from "../config";

import Database from "better-sqlite3";
import * as schema from "./schema/schema";
import * as drizzle from "drizzle-orm/better-sqlite3";

const driver = new Database(Config.database_file);
const db = drizzle.drizzle(driver, {schema});

export default db;
