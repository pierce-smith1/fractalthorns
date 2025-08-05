import * as Domain from "../../helpers/domain"
import * as Record from "../../helpers/record"
import * as Fetchers from "../../fetchers"

export type Theme = {
    primary_color: string,
    secondary_color: string,
};

export const default_theme = {
    primary_color: "#ffffff",
    secondary_color: "#000000",
};

export const theme_overrides: {[domain in Domain.Domain]?: {[name: string]: Theme}} = {
    "episodic": {
        "repentance": {
            primary_color: "#2c2d32",
            secondary_color: "#a1a4b7",
        },
        "somehow-i-knew": {
            primary_color: "#ffc6dd",
            secondary_color: "#ffffff",
        },
    },
};

export const rune_colors: Array<Theme> = [
    {primary_color: "#0d4f9c", secondary_color: "#94afc8"},
    {primary_color: "#000000", secondary_color: "#000000"},
    {primary_color: "#1d82b6", secondary_color: "#12a1cc"},
    {primary_color: "#fac398", secondary_color: "#ffffaa"},
    {primary_color: "#9bacdc", secondary_color: "#59771f"},
    {primary_color: "#ffffff", secondary_color: "#ffeebb"},
    {primary_color: "#00ea42", secondary_color: "#352929"},
    {primary_color: "#c01e1c", secondary_color: "#866bca"},
    {primary_color: "#b62c37", secondary_color: "#ffffff"},
    {primary_color: "#abdbe9", secondary_color: "#ffffff"},
    {primary_color: "#fc00b4", secondary_color: "#fd01c8"},
    {primary_color: "#077d86", secondary_color: "#57375e"},
    {primary_color: "#545454", secondary_color: "#ae8888"},
    {primary_color: "#df4af0", secondary_color: "#37457e"},
    {primary_color: "#026ed1", secondary_color: "#0055a2"},
    {primary_color: "#a6aed3", secondary_color: "#314027"},
    {primary_color: "#d3d322", secondary_color: "#25892a"},
    {primary_color: "#1618a0", secondary_color: "#c01e1c"},
    {primary_color: "#d0805a", secondary_color: "#e88038"},
    {primary_color: "#5010bb", secondary_color: "#300033"},
];

export async function get_theme_for_page(page: Domain.Page) {
    if (page.domain === "home" && page.rune_i != null) {
        const rune_theme = rune_colors[page.rune_i];

        if (!rune_theme) {
            return default_theme;
        }

        return rune_theme;
    }

    if (page.domain === "image") {
        const image = await Fetchers.get.single_image({name: page.name});

        const override = theme_overrides["image"]?.[page.name ?? ""];
        if (override) {
            return override;
        }

        return {
            primary_color: image.primary_color ?? default_theme.primary_color,
            secondary_color: image.secondary_color ?? default_theme.secondary_color,
        };
    }

    if (page.domain === "sketch") {
        const sketch = await Fetchers.get.single_sketch({name: page.name});

        const override = theme_overrides["sketch"]?.[page.name ?? ""];
        if (override) {
            return override;
        }

        if (sketch) {
            return {
                primary_color: sketch.primary_color ?? default_theme.primary_color,
                secondary_color: sketch.secondary_color ?? default_theme.secondary_color,
            };
        }
    }

    if (page.domain === "episodic") {
        const record = await Fetchers.get.single_record({name: page.record_name});

        const override = theme_overrides["episodic"]?.[page.record_name ?? ""];
        if (override) {
            return override;
        }

        return {
            primary_color: Record.get_iteration_color(record.iteration),
            secondary_color: "#000000",
        };
    }

    if (page.domain === "discover") {
        const puzzle = await Fetchers.get.single_puzzle({name: page.name});

        const override = theme_overrides["discover"]?.[page.name ?? ""];
        if (override) {
            return override;
        }

        return {
            primary_color: puzzle.primary_color,
            secondary_color: puzzle.secondary_color,
        };
    }

    return default_theme;
}

type RuneI = number | undefined;
const local_rune_i_key = "rune_i";

export let rune: {i: RuneI} = $state({i: load_rune_i()});

export function save_rune_i(rune_i: RuneI) {
    if (rune_i == null) {
        localStorage.removeItem(local_rune_i_key);
    } else {
        localStorage.setItem(local_rune_i_key, `${rune_i}`);
    }
}

export function load_rune_i(): RuneI {
    const stored_value = localStorage.getItem(local_rune_i_key);

    const rune_i = stored_value
        ? parseInt(stored_value)
        : undefined;

    return rune_i;
}
