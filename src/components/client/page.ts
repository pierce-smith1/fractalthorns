import * as Store from "svelte/store";

import * as Domain from "../../helpers/domain";
import * as Fetchers from "../../fetchers";
import * as RecordHelpers from "../../helpers/record";

export const env = Store.writable<"local" | "test" | "prod">("prod");
export const current = Store.writable<Domain.Page>({domain: "home"});

// only relevant for small screens
export type LayoutState = 
    | "only-nav"
    | "only-page"
    | "full"

export const layout_state = Store.writable<LayoutState>("full");

export type Theme = {
    primary_color: string,
    secondary_color: string,
};

export const default_theme = {
    primary_color: "#ffffff",
    secondary_color: "#000000",
};

let home_theme: Theme | null = null;

export async function get_theme(current_page: Domain.Page): Promise<Theme> {
    console.log(current_page);
    if (current_page.domain === "home" && home_theme != null) {
        return home_theme;
    }

    if (current_page.domain === "image") {
        const image = await Fetchers.get.single_image({name: current_page.name});

        return {
            primary_color: image.primary_color ?? default_theme.primary_color,
            secondary_color: image.secondary_color ?? default_theme.secondary_color,
        };
    }

    if (current_page.domain === "sketch") {
        const {sketches} = await Fetchers.get.all_sketches({});
        const sketch = sketches.find(sketch => sketch.name === current_page.name);

        if (sketch) {
            return {
                primary_color: sketch.primary_color ?? default_theme.primary_color,
                secondary_color: sketch.secondary_color ?? default_theme.secondary_color,
            };
        }
    }

    if (current_page.domain === "episodic") {
        const record = await Fetchers.get.single_record({name: current_page.record_name});

        if (record.name === "repentance") {
            return {
                primary_color: "#2c2d32",
                secondary_color: "#a1a4b7",
            };
        }

        if (record.name === "somehow-i-knew") {
            return {
                primary_color: "#ffc6dd",
                secondary_color: "#ffffff",
            };
        }

        return {
            primary_color: RecordHelpers.get_iteration_color(record.iteration),
            secondary_color: "#000000",
        };
    }

    if (current_page.domain === "discover") {
        const puzzle = await Fetchers.get.single_puzzle({name: current_page.name});
        return puzzle;
    }

    return default_theme;
}

export function set_home_theme(theme: Theme) {
    home_theme = theme;
}

export const theme_promise = Store.derived(current, get_theme);
