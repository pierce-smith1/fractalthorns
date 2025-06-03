import p5 from "p5";

export type ImageDefs = {
    [key: string]: Array<string> | string
};

export abstract class Artist {
    abstract width(): number;
    abstract height(): number;

    abstract draw(p5: p5): void;
    abstract preload(p5: p5): void;

    setup(p5: p5, canvas: HTMLCanvasElement) {
        p5.createCanvas(this.width(), this.height(), p5.P2D, canvas);
    }
}
