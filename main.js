import express from "express";
import apicache from "apicache";
import {handler as fractalthorns_handler} from "./fractalthorns/dist/server/entry.mjs";

const NOTIFICATIONS_ROUTE = "/notifications";
const ADMIN_KEY = process.env.RVA_ADMIN_KEY;

const ft_api_cache = apicache.middleware("1 day", (req, res) => 
    req.url.startsWith("/api") || req.url.startsWith("/serve")
);

let clients = {};
function register_sse_client_connection(endpoint_name, req, res) {
    clients[endpoint_name] ??= [];

    const client_id = Date.now();

    console.log(`[${new Date()}] got sse client ${client_id} for ${endpoint_name}`);

    res.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Connection": "keep-alive",
        "Cache-Control": "no-cache",
    });

    clients[endpoint_name].push({id: client_id, connection: res});

    req.on("close", () => {
        clients[endpoint_name] = clients[endpoint_name].filter(client => client.id !== client_id);
        console.log(`[${new Date()}] bye sse client ${client_id} for ${endpoint_name}`);
    });
}

function write_to_clients(target_clients, message) {
    for (const {connection} of target_clients ?? []) {
        connection.write(`data: ${message}\n\n`);
    }
}

function post_notifications_handler(endpoint_name, req, res) {
    write_to_clients(clients[endpoint_name], req.body);
    res.sendStatus(200);
}

function start_notifications_test_loop() {
    setInterval(() => {
        const dummy_object = {
            title: "test",
            items: [
                "test item 1",
                "test item 2 **now with bold text**",
            ],
            date: new Date().toISOString(),
            version: "dummy-version-string",
        };

        write_to_clients(clients["notifications-test"], `news_update/${JSON.stringify(dummy_object)}`);
    }, 10 * 1000);
}

function start_keepalive_loop() {
    setInterval(() => {
        for (const client_list of Object.values(clients)) {
            for (const {id, connection} of client_list) {
                console.log(`heartbeat to ${id}`);
                connection.write(`:\n\n`);
            }
        }
    }, 60 * 1000);
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

    app.get(
        NOTIFICATIONS_ROUTE,
        (req, res) => register_sse_client_connection("notifications", req, res)
    );
    app.get(
        `${NOTIFICATIONS_ROUTE}-test`, 
        (req, res) => register_sse_client_connection("notifications-test", req, res)
    );
    app.post(
        NOTIFICATIONS_ROUTE, 
        (req, res) => post_notifications_handler("notifications", req, res)
    );

    app.listen(4321);

    start_keepalive_loop();
    start_notifications_test_loop();
}

run_express_app();