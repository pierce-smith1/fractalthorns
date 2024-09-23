import * as Sketches from "../stores/sketch";
import * as Api from "../api";

export function to_api_object(sketch_item: Sketches.Sketch): Api.SketchObject {
    const object = {
        name: sketch_item.name,
        title: sketch_item.name.replaceAll(/[-_]/g, " "),
        image_url: `/serve/sketch_image/${sketch_item.name}`,
        thumb_url: `/serve/sketch_thumb/${sketch_item.name}`,
    };

    return object;
}