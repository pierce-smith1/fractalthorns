import * as Store from "svelte/store";

import * as Domain from "../../descriptors/domain";
import * as Fetchers from "../../fetchers";
import * as Episodic from "../../descriptors/public/episodic";

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

export async function get_theme(current_page: Domain.Page): Promise<Theme> {

    if (current_page.domain === "image") {
        const image = await Fetchers.get.single_image({name: current_page.name});
        return {
            primary_color: image.primary_color ?? default_theme.primary_color,
            secondary_color: image.secondary_color ?? default_theme.secondary_color,
        };
    }

    if (current_page.domain === "episodic") {
        const record = await Fetchers.get.single_record({name: current_page.record_name});
        return {
            primary_color: Episodic.get_iteration_color(record.iteration),
            secondary_color: "#000000",
        };
    }

    return default_theme;
}

export const theme_promise = Store.derived(current, get_theme);