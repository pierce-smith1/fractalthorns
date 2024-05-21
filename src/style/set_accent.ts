type Color = {
    red: number,
    green: number,
    blue: number,
};

export function set_page_accent(color: Color) {
    const stylesheet = document.styleSheets[0];
    const root_rule = stylesheet.cssRules[0];

    const color_light = {
        red: clamp(color.red + ((255 - color.red) / 1.2), 0, 255),
        green: clamp(color.green + ((255 - color.green) / 1.2), 0, 255),
        blue: clamp(color.blue + ((255 - color.blue) / 1.2), 0, 255),
    };

    const color_dark = {
        red: clamp(color.red - (color.red / 2), 0, 255),
        green: clamp(color.green - (color.green / 2), 0, 255),
        blue: clamp((color.blue - (color.blue / 2)) * 1.2, 0, 255),
    };

    // @ts-ignore
    root_rule.style.setProperty("--accent-light", color_to_string(color_light));
    // @ts-ignore
    root_rule.style.setProperty("--accent", color_to_string(color));
    // @ts-ignore
    root_rule.style.setProperty("--accent-dark", color_to_string(color_dark));
}

function clamp(n: number, min: number, max: number) {
    return n < min ? 
        min 
        : n > max ?
            max
            : n;
}

function color_to_string(color: Color): string {
    const color_component_to_string = (c: number) => {
        const hex_byte = Math.round(c).toString(16).padStart(2, "0");
        return hex_byte;
    };

    const hex_string = `#${color_component_to_string(color.red)}${color_component_to_string(color.green)}${color_component_to_string(color.blue)}`;
    return hex_string;
}