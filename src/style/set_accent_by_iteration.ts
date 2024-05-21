import {set_page_accent} from "./set_accent";
import {iteration_style_container_id} from "./constants";

const page_container = document.querySelector(`#${iteration_style_container_id}`);
// @ts-ignore god damn you're the worst
const iteration = page_container.dataset.iteration;

const accent_color = (() => {
    switch (iteration) {
        case "265404": return {red: 0xea, green: 0x00, blue: 0x42};
        case "768221": return {red: 0xea, green: 0x00, blue: 0xea};
    }
})();

if (accent_color) {
    set_page_accent(accent_color);
}