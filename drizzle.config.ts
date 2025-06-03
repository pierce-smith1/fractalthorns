import Config from "./src/config";

import * as DrizzleKit from "drizzle-kit";

export default DrizzleKit.defineConfig({
    dialect: "sqlite",
    schema: "./src/data/schema/schema.ts",
    dbCredentials: {
        url: `${Config.database_file}`,
    },
});