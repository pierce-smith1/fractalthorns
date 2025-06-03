import p5 from "p5";

export type PuzzleModule = {
    sketch: {
        set_complete_handler: (fn: (unlocked_records: Array<string>) => void) => void,
        (ctx: p5): void,
    },
};

export const puzzle_canvas_id = "puzzle-canvas";