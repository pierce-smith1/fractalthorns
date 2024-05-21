import * as Store from "svelte/store";

import * as Domain from "../../descriptors/domain";

export const current = Store.writable<Domain.Page>({domain: "home"});