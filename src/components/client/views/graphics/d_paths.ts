import p5 from "p5"

type BezierCurve = {
    start_x: number,
    start_y: number,
    start_cp_x: number,
    start_cp_y: number,
    end_cp_x: number,
    end_cp_y: number,
    end_x: number,
    end_y: number,
};

export type PathCommand =
    | {type: "m", dx: number, dy: number}
    | {type: "M", x: number, y: number}
    | {type: "l", dx: number, dy: number}
    | {type: "L", x: number, y: number}
    | {type: "h", dx: number}
    | {type: "H", x: number}
    | {type: "v", dy: number}
    | {type: "V", y: number}
    | {type: "c", dx1: number, dy1: number, dx2: number, dy2: number, dx: number, dy: number}
    | {type: "C", x1: number, y1: number, x2: number, y2: number, x: number, y: number}
    | {type: "s", dx2: number, dy2: number, dx: number, dy: number}
    | {type: "S", x2: number, y2: number, x: number, y: number}

function tokenize_path(path: string): Array<string> {
    const tokens: Array<string> = [];

    let i = 0;
    while (i < path.length) {
        const peek = () => path[i];
        const consume = () => path[i++];

        if (/[a-zA-Z]/.test(peek())) {
            tokens.push(consume());
        }
        else if (peek() === " ") {
            consume();
        }
        else if (/[0-9.-]/.test(peek())) {
            let token = consume();

            let dot_seen = token === ".";

            while (peek() != null && /[0-9.]/.test(peek())) {
                if (peek() === "." && !dot_seen) {
                    dot_seen = true;
                }
                else if (peek() === "." && dot_seen) {
                    break;
                }

                token += consume();
            }

            tokens.push(token);
        }
        else {
            die(`Unhandleable character ${peek()}`);
        }
    }

    console.log({tokens});

    return tokens;
}

export function d_path_to_commands(path: string): Array<PathCommand> {
    const tokens = tokenize_path(path);

    const commands: Array<PathCommand> = [];

    let i = 0;
    while (i < tokens.length) {
        const peek = () => tokens[i];
        const consume = () => tokens[i++] ?? die("Unexpected end of path");

        const parse_m = () => commands.push({
            type: "m",
            dx: parse_float_or_die(consume()),
            dy: parse_float_or_die(consume()),
        });

        const parse_M = () => commands.push({
            type: "M",
            x: parse_float_or_die(consume()),
            y: parse_float_or_die(consume()),
        });

        const parse_l = () => commands.push({
            type: "l",
            dx: parse_float_or_die(consume()),
            dy: parse_float_or_die(consume()),
        });

        const parse_L = () => commands.push({
            type: "L",
            x: parse_float_or_die(consume()),
            y: parse_float_or_die(consume()),
        });

        const parse_h = () => commands.push({
            type: "h",
            dx: parse_float_or_die(consume()),
        });

        const parse_H = () => commands.push({
            type: "H",
            x: parse_float_or_die(consume()),
        });

        const parse_v = () => commands.push({
            type: "v",
            dy: parse_float_or_die(consume()),
        });

        const parse_V = () => commands.push({
            type: "V",
            y: parse_float_or_die(consume()),
        });

        const parse_c = () => commands.push({
            type: "c",
            dx1: parse_float_or_die(consume()),
            dy1: parse_float_or_die(consume()),
            dx2: parse_float_or_die(consume()),
            dy2: parse_float_or_die(consume()),
            dx: parse_float_or_die(consume()),
            dy: parse_float_or_die(consume()),
        });

        const parse_C = () => commands.push({
            type: "C",
            x1: parse_float_or_die(consume()),
            y1: parse_float_or_die(consume()),
            x2: parse_float_or_die(consume()),
            y2: parse_float_or_die(consume()),
            x: parse_float_or_die(consume()),
            y: parse_float_or_die(consume()),
        });

        const parse_s = () => commands.push({
            type: "s",
            dx2: parse_float_or_die(consume()),
            dy2: parse_float_or_die(consume()),
            dx: parse_float_or_die(consume()),
            dy: parse_float_or_die(consume()),
        });

        const parse_S = () => commands.push({
            type: "S",
            x2: parse_float_or_die(consume()),
            y2: parse_float_or_die(consume()),
            x: parse_float_or_die(consume()),
            y: parse_float_or_die(consume()),
        });

        const cmd_token = consume();

        if (cmd_token === "m") {
            parse_m();
            while (is_float(peek())) parse_l();
        }
        else if (cmd_token === "M") {
            parse_M();
            while (is_float(peek())) parse_L();
        }
        else if (cmd_token === "l") {
            while (is_float(peek())) parse_l();
        }
        else if (cmd_token === "L") {
            while (is_float(peek())) parse_L();
        }
        else if (cmd_token === "h") {
            while (is_float(peek())) parse_h();
        }
        else if (cmd_token === "H") {
            while (is_float(peek())) parse_H();
        }
        else if (cmd_token === "v") {
            while (is_float(peek())) parse_v();
        }
        else if (cmd_token === "V") {
            while (is_float(peek())) parse_V();
        }
        else if (cmd_token === "c") {
            while (is_float(peek())) parse_c();
        }
        else if (cmd_token === "C") {
            while (is_float(peek())) parse_C();
        }
        else if (cmd_token === "s") {
            while (is_float(peek())) parse_s();
        }
        else if (cmd_token === "S") {
            while (is_float(peek())) parse_S();
        }
        else {
            die(`Unimplemented/unrecognized token ${peek()}`);
        }
    }

    console.log({commands});

    return commands;
}

const last_bezier_end_cp: {x?: number, y?: number} = {};
const brush = {x: 0, y: 0};
export function draw_d_path(commands: Array<PathCommand>, wiggle_scale: number, ctx: p5) {
    const t = Date.now() / 1000;

    brush.x = 0;
    brush.y = 0;

    ctx.beginShape();

    for (let i = 0; i < commands.length; i++) {
        const command = commands[i];
        const prev_command = commands[i - 1];

        if (command.type === "m") {
            brush.x += command.dx;
            brush.y += command.dy;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "M") {
            brush.x = command.x;
            brush.y = command.y;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "l") {
            brush.x += command.dx;
            brush.y += command.dy;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "L") {
            brush.x = command.x;
            brush.y = command.y;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "h") {
            brush.x += command.dx;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "H") {
            brush.x = command.x;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "v") {
            brush.y += command.dy;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "V") {
            brush.y = command.y;

            ctx.vertex(brush.x, brush.y);

            last_bezier_end_cp.x = undefined;
            last_bezier_end_cp.y = undefined;
        }
        else if (command.type === "c") {
            const end_x = brush.x + command.dx + ctx.sin(t);
            const end_y = brush.y + command.dx + ctx.sin(t);

            ctx.bezierVertex(
                brush.x + command.dx1, brush.y + command.dy1,
                brush.x + command.dx2, brush.y + command.dy2,
                brush.x + command.dx, brush.y + command.dy
            );

            last_bezier_end_cp.x = brush.x + command.dx2;
            last_bezier_end_cp.y = brush.y + command.dy2;

            brush.x += command.dx;
            brush.y += command.dy;
        }
        else if (command.type === "C") {
            ctx.bezierVertex(
                command.x1, command.y1,
                command.x2, command.y2,
                command.x, command.y
            );

            last_bezier_end_cp.x = command.x2;
            last_bezier_end_cp.y = command.y2;

            brush.x = command.x;
            brush.y = command.y;
        }
        else if (command.type === "s") {
            const end_cp_x = brush.x + command.dx2;
            const end_cp_y = brush.y + command.dy2;

            const start_cp_x = last_bezier_end_cp.x
                ? brush.x - (last_bezier_end_cp.x - brush.x)
                : brush.x;
            const start_cp_y = last_bezier_end_cp.y
                ? brush.y - (last_bezier_end_cp.y - brush.y)
                : brush.y;

            ctx.bezierVertex(
                start_cp_x, start_cp_y,
                end_cp_x, end_cp_y,
                brush.x + command.dx, brush.y + command.dy
            );

            last_bezier_end_cp.x = end_cp_x;
            last_bezier_end_cp.y = end_cp_y;

            brush.x += command.dx;
            brush.y += command.dy;
        }
        else if (command.type === "S") {
            const start_cp_x = last_bezier_end_cp.x
                ? brush.x - (last_bezier_end_cp.x - brush.x)
                : brush.x;
            const start_cp_y = last_bezier_end_cp.y
                ? brush.y - (last_bezier_end_cp.y - brush.y)
                : brush.y;

            ctx.bezierVertex(
                start_cp_x, start_cp_y,
                command.x2, command.y2,
                command.x, command.y
            );

            last_bezier_end_cp.x = command.x2;
            last_bezier_end_cp.y = command.y2;

            brush.x = command.x;
            brush.y = command.y;
        }
    }

    ctx.endShape();
}

function is_float(input: string): boolean {
    const is_float = !isNaN(parseFloat(input));
    return is_float;
}

function parse_float_or_die(input: string): number {
    const n = isNaN(parseFloat(input)) ? die(`Expected number: ${input}`) : parseFloat(input);
    return n;
}

function die(msg: string): never {
    throw new Error(msg);
}
