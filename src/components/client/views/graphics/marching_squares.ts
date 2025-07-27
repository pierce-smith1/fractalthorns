import p5 from "p5"

export type ImplicitFunction = (x: number, y: number) => number;

type RealCoord = {
    x: number,
    y: number,
}

const default_square_size = 12;

export function draw_implicit(fn: ImplicitFunction, threshold: number, ctx: p5) {
    ctx.push();

    const square_size = default_square_size;

    const center = {x: ctx.width / 2, y: ctx.height / 2};
    ctx.translate(center.x, center.y);

    for_all_cells(cell => {
        const {
            top_left: tl,
            top_right: tr,
            bot_left: bl,
            bot_right: br,
        } = get_corners(cell, square_size);

        const top_left_above = fn(tl.x, tl.y) > threshold;
        const top_right_above = fn(tr.x, tr.y) > threshold;
        const bot_right_above = fn(br.x, br.y) > threshold;
        const bot_left_above = fn(bl.x, bl.y) > threshold;

        const pattern =
            (top_left_above ? 8 : 0) +
            (top_right_above ? 4 : 0) +
            (bot_right_above ? 2 : 0) +
            (bot_left_above ? 1 : 0);

        const point_groups: Array<[RealCoord, RealCoord]> =
            pattern === 1 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(bl, tl, "y"),
            ]] : pattern === 2 ? [[
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(br, bl, "x"),
            ]] : pattern === 3 ? [[
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 4 ? [[
                get_isoline_point_between(br, tr, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 5 ? [
                [
                    get_isoline_point_between(tl, tr, "x"),
                    get_isoline_point_between(tl, bl, "y"),
                ], [
                    get_isoline_point_between(bl, br, "x"),
                    get_isoline_point_between(tr, br, "y"),
                ]
            ] : pattern === 6 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 7 ? [[
                get_isoline_point_between(tl, tr, "x"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 8 ? [[
                get_isoline_point_between(tl, bl, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 9 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 10 ? [
                [
                    get_isoline_point_between(tr, br, "y"),
                    get_isoline_point_between(tl, tr, "x"),
                ],
                [
                    get_isoline_point_between(br, bl, "x"),
                    get_isoline_point_between(tl, bl, "y"),
                ]
            ] : pattern === 11 ? [[
                get_isoline_point_between(br, tr, "y"),
                get_isoline_point_between(tl, tr, "x"),
            ]] : pattern === 12 ? [[
                get_isoline_point_between(tr, br, "y"),
                get_isoline_point_between(tl, bl, "y"),
            ]] : pattern === 13 ? [[
                get_isoline_point_between(br, bl, "x"),
                get_isoline_point_between(tr, br, "y"),
            ]] : pattern === 14 ? [[
                get_isoline_point_between(bl, br, "x"),
                get_isoline_point_between(bl, tl, "y"),
            ]] : [];

        for (const [a, b] of point_groups) {
            ctx.line(a.x, a.y, b.x, b.y);
        }

        function get_isoline_point_between(a: RealCoord, b: RealCoord, orientation: "x" | "y"): RealCoord {
            const dimension = orientation;
            const fixed_dimension = dimension === "x" ? "y" : "x";

            const point_var = ctx.map(
                threshold,
                fn(a.x, a.y), fn(b.x, b.y),
                a[dimension], b[dimension]
            );

            const point = {
                [dimension]: point_var,
                [fixed_dimension]: a[fixed_dimension],
            } as RealCoord;

            return point;
        }
    }, square_size, ctx);

    ctx.pop();
}

function for_all_cells(fn: (coord: RealCoord) => void, square_size: number, ctx: p5) {
    const y_span = Math.min(
        Math.ceil(ctx.height / 2 / square_size) * square_size,
        500 // TODO: Brittle optimization
    );
    const x_span = Math.min(
        Math.ceil(ctx.width / 2 / square_size) * square_size,
        500
    );

    for (let y = -y_span; y < y_span; y += square_size) {
        for (let x = -x_span; x < x_span; x += square_size) {
            fn({x, y});
        }
    }
}

function get_corners(top_left: RealCoord, square_size: number) {
    const top_right = {x: top_left.x + square_size, y: top_left.y};
    const bot_left  = {x: top_left.x, y: top_left.y + square_size};
    const bot_right = {x: top_left.x + square_size, y: top_left.y + square_size};

    return {top_left, top_right, bot_left, bot_right};
}

