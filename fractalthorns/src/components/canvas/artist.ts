import p5 from "p5";

export type ImageDefs = {
    [key: string]: Array<string> | string
};

const global_load_cache: {[key: string]: p5.Image} = {};

export abstract class Artist<I extends ImageDefs> {
    loaded_images: {
        [key in keyof I]: I[key] extends string ? 
            p5.Image 
            : Array<p5.Image>
    } = {} as typeof this.loaded_images;
    
    abstract width(): number;
    abstract height(): number;

    abstract image_defs(): I;

    abstract draw(p5: p5): void;

    preload(p5: p5) {
        const get_and_cache = (filename: string) => {
            if (!global_load_cache[filename]) {
                global_load_cache[filename] = p5.loadImage(filename);
            }

            return global_load_cache[filename];
        }

        for (const [name, image_or_images] of Object.entries(this.image_defs())) {
            if (typeof image_or_images === "string") {
                // @ts-ignore
                this.loaded_images[name] = get_and_cache(image_or_images);
            } else {
                // @ts-ignore
                this.loaded_images[name] = image_or_images.filter(image => image).map(get_and_cache);
            }
        }
    }

    setup(p5: p5, canvas: HTMLCanvasElement) {
        p5.createCanvas(this.width(), this.height(), p5.P2D, canvas);
    }
}
