import Config from "../config";

import * as Store from "./_store";
import * as Filesystem from "../filesystem";

export type Sketch = {
    name: string,
};

export class SketchStore extends Store.Store<Sketch> {
    async load() {
        const sketch_root_path = `${Config.authorland_root}/sketches`;
        const sketch_list_path = `${sketch_root_path}/sketches.json`;

        const sketch_list_contents = await Filesystem.read(sketch_list_path);
        const sketch_names_list = JSON.parse(sketch_list_contents) as Array<string>;

        const sketch_list = sketch_names_list.map(name => ({name}));

        return sketch_list;
    }
}

const store = new SketchStore();
export default store;