import p5 from "p5";

export function make_sketch(puzzle_name: string, solve_code: string) {
    let lekton: p5.Font;

    let solved = false;
    let complete_handler: any;

    const sketch = function(ctx: p5) {
        ctx.preload = () => {
            lekton = ctx.loadFont("/assets/fonts/Lekton-Bold.ttf");
        };
        
        ctx.setup = () => {
            const puzzle_canvas_element = document.querySelector(`#puzzle-canvas`) as HTMLCanvasElement;
            puzzle_canvas_element.oncontextmenu = () => false;
            ctx.createCanvas(800, 600, "p2d", puzzle_canvas_element);

            ctx.textFont(lekton);
        };

        ctx.draw = () => {
            ctx.clear();

            ctx.translate(ctx.width / 2, ctx.height / 2);
            ctx.textAlign(ctx.CENTER);
            ctx.noStroke();
            ctx.fill(255);

            if (!solved) {
                ctx.text("press 'p' to solve the puzzle", 0, 0);
            } else {
                ctx.text("wow! youre smart!", 0, 0);
            }
        };
        
        ctx.keyPressed = () => {
            if (ctx.key === "p") {
                solved = true;

                fetch(`/api/v1/solve_puzzle?body=${JSON.stringify({name: puzzle_name, code: solve_code})}`, {method: "POST"})
                    .then(response => response.json())
                    .then(response => complete_handler(response.unlocked_records));
            }

        }
    };

    // @ts-ignore
    sketch.set_complete_handler = (fn) => complete_handler = fn;

    return sketch;
}