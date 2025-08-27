import * as Domain from "../../helpers/domain"

// only relevant for small screens
export type LayoutState =
    | "only-nav"
    | "only-page"
    | "full"

export type PageState = {
    env: "local" | "test" | "prod",
    current: Domain.Page,
    layout: LayoutState,
    minimized: boolean,
};

export let state: PageState = $state({
    env: "prod",
    current: {domain: "home"},
    layout: "full",
    minimized: false,
});
