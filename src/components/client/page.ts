import * as Store from "svelte/store";

import * as Domain from "../../descriptors/domain";

export const current = Store.writable<Domain.Page>({domain: "home"});

// only relevant for small screens
export type LayoutState = 
    | "only-nav"
    | "only-page"
    | "full"

export const layout_state = Store.writable<LayoutState>("full");