import Config from "../config";

import * as Store from "./_store";
import * as Filesystem from "../filesystem";

export type Sketch = {
    prefix: string,
    name: string,
};

export class SketchStore extends Store.Store<Sketch> {
    async load() {
        const sketch_root_path = `${Config.authorland_root}/sketches`;

        const sketch_files = (await Filesystem.enumerate(sketch_root_path))
            .filter(item => item.type === "File");
        
        const sketches = sketch_files
            .map(item => item.name.split("."))
            .map(([prefix, name]) => ({prefix, name, ordinal: parseInt(prefix)}) as const)
            .toSorted((a, b) => b.ordinal - a.ordinal);

        return sketches;
    }
}

const store = new SketchStore();
export default store;