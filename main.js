import express from "express";
import apicache from "apicache";
import {handler as fractalthorns_handler} from "./fractalthorns/dist/server/entry.mjs";

const NOTIFICATIONS_ROUTE = "/notifications";
const ADMIN_KEY = process.env.RVA_ADMIN_KEY;

const ft_api_cache = apicache.middleware("1 day", (req, res) => 
    req.url.startsWith("/api") || req.url.startsWith("/serve")
);

let clients = [];
function get_notifications_handler(req, res) {
    const client_id = Date.now();
    clients.push({id: client_id, connection: res});

    console.log(`got client ${client_id}`);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
    });

    req.on("close", () => {
        clients = clients.filter(client => client.id !== client_id);
        console.log(`bye client ${client_id}`);
    });
}

function post_notifications_handler(req, res) {
    for (const {connection} of clients) {
        connection.write(`data: ${req.body}\n\n`);
    }

    res.sendStatus(200);
}

function run_express_app() {
    const app = express();

    app.use(express.text());
    app.use(ft_api_cache);
    app.use("/", express.static("./fractalthorns/dist/client/"));
    app.use((req, res, next) => {
        const is_for_notifications_route = req.url.startsWith(NOTIFICATIONS_ROUTE);
        const is_post_request = req.method === "POST";
        const client_accepts_eventstream = req.get("Accept") === "text/event-stream";
        const correct_admin_key = req.get("ft-admin-key") === ADMIN_KEY;

        if (is_post_request && !correct_admin_key) {
            res.sendStatus(403);
            return;
        }

        if (is_for_notifications_route && (client_accepts_eventstream || is_post_request)) {
            next();
        } else {
            fractalthorns_handler(req, res, next);
        }
    });

    app.get(NOTIFICATIONS_ROUTE, get_notifications_handler);
    app.post(NOTIFICATIONS_ROUTE, post_notifications_handler);

    app.listen(4321);
}

run_express_app();