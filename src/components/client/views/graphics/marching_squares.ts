import p5 from "p5"

export type ImplicitFunction = (x: number, y: number) => number;

type RealCoord = {
    x: number,
    y: number,
}

type SquareCoord = {
    xs: number,
    ys: number,
}

const default_square_size = 16;

function memoize(fn: ImplicitFunction): ImplicitFunction {
    const memo: {[x: number]: {[y: number]: number}} = {};
    return (x, y) => {
        memo[x] ??= {};

        if (memo[x][y]) {
            return memo[x][y];
        }

        const v = fn(x, y);
        memo[x][y] = v;

        return v;
    };
}

function square_to_real(square: SquareCoord, square_size: number): [number, number] {
    return [square.xs * square_size, square.ys * square_size];
}

export function draw_implicit(fn: ImplicitFunction, threshold: number, ctx: p5) {
    ctx.push();

    fn = memoize(fn);

    const square_size = default_square_size;

    const center = {x: ctx.width / 2, y: ctx.height / 2};
    ctx.translate(center.x, center.y);

    for_all_cells((real, square) => {
        ctx.point(real.x, real.y);

        const {
            top_left: tl,
            top_right: tr,
            bot_left: bl,
            bot_right: br,
        } = get_corners(square);

        const top_left_above = fn(...square_to_real(tl, square_size)) > threshold;
        const top_right_above = fn(...square_to_real(tr, square_size)) > threshold;
        const bot_right_above = fn(...square_to_real(br, square_size)) > threshold;
        const bot_left_above = fn(...square_to_real(bl, square_size)) > threshold;

        const pattern =
            (top_left_above ? 8 : 0) +
            (top_right_above ? 4 : 0) +
            (bot_right_above ? 2 : 0) +
            (bot_left_above ? 1 : 0);

        const point_groups: Array<[SquareCoord, SquareCoord]> =
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
            const [ax, ay] = square_to_real(a, square_size);
            const [bx, by] = square_to_real(b, square_size);
            ctx.line(ax, ay, bx, by);
        }

        function get_isoline_point_between(a: SquareCoord, b: SquareCoord, orientation: "x" | "y"): SquareCoord {
            const dimension: keyof SquareCoord = orientation === "x" ? "xs" : "ys";
            const fixed_dimension: keyof SquareCoord = dimension === "xs" ? "ys" : "xs";

            const point_var = ctx.map(
                threshold,
                fn(...square_to_real(a, square_size)), fn(...square_to_real(b, square_size)),
                a[dimension], b[dimension]
            );

            const point = {
                [dimension]: point_var,
                [fixed_dimension]: a[fixed_dimension],
            } as SquareCoord;

            return point;
        }
    }, square_size, ctx);

    ctx.pop();
}

function draw_shape(points: Array<SquareCoord>, square_size: number, ctx: p5) {
    ctx.beginShape();

    for (const point of points) {
        ctx.vertex(...square_to_real(point, square_size));
    }

    ctx.endShape();
}

function for_all_cells(fn: (real: RealCoord, square: SquareCoord) => void, square_size: number, ctx: p5) {
    const y_span = Math.ceil(ctx.height / 2 / square_size) * square_size;
    const x_span = Math.ceil(ctx.width / 2 / square_size) * square_size;

    for (let y = -y_span; y < y_span; y += square_size) {
        for (let x = -x_span; x < x_span; x += square_size) {
            const ys = y / square_size;
            const xs = x / square_size;

            fn({x, y}, {xs, ys});
        }
    }
}

function get_corners(top_left: SquareCoord) {
    const top_right = {xs: top_left.xs + 1, ys: top_left.ys    };
    const bot_left  = {xs: top_left.xs    , ys: top_left.ys + 1};
    const bot_right = {xs: top_left.xs + 1, ys: top_left.ys + 1};

    return {top_left, top_right, bot_left, bot_right};
}

