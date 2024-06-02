import * as Store from "svelte/store";

import * as Domain from "../../descriptors/domain";

export type NavItem = Domain.Item & {hide?: boolean};
export const current_items = Store.writable<Array<NavItem>>([]);