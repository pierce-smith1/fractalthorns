import express from "express";
import apicache from "apicache";
import {handler as fractalthorns_handler} from "./fractalthorns/dist/server/entry.mjs";

const ft_api_cache = apicache.middleware("1 day", (req, res) => 
    req.url.startsWith("/api") || req.url.startsWith("/serve")
);

const app = express();

app.use(ft_api_cache);
app.use("/", express.static("./fractalthorns/dist/client/"));
app.use(fractalthorns_handler);

app.listen(4321);