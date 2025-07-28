import * as ImageLoader from "./loaders/image"

import * as Filesystem from "../filesystem"

const file = process.argv[2];
const data = await Filesystem.read_binary(file);

console.log(file);

const colors = await ImageLoader.load_dominant_colors(data);

console.log({colors});
