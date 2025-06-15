<script lang="ts">
    import * as Domain from "../../helpers/domain.ts";
    import * as Nav from "./nav.ts";
    import {current, layout_state} from "./page.ts";

    export let dest: Domain.Page;
    export let cause_layout_switch: boolean = false;

    async function navigate(event: MouseEvent) {
        event.preventDefault();

        window.history.pushState(dest, "", Domain.page_to_path(dest));

        const actual_dest = Nav.is_incomplete_page(dest)
            ? await Nav.get_landing_page(dest.domain)
            : dest;

        $current = actual_dest;

        if (cause_layout_switch && $layout_state !== "full") {
            $layout_state = "only-page";
        }

        Nav.set_domain_items(dest.domain);
    }

    window.onpopstate = (event: PopStateEvent) => {
        $current = event.state;
    };
</script>

<a href={Domain.page_to_path(dest)} on:click={navigate}> 
    <slot />
</a>