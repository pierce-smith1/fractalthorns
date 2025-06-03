<script lang="ts">
    import * as Domain from "../../helpers/domain.ts";
    import {current, layout_state} from "./page.ts";

    export let dest: Domain.Page;
    export let cause_layout_switch: boolean = false;

    import {set_domain_items} from "./nav.ts";

    function navigate(event: MouseEvent) {
        event.preventDefault();

        window.history.pushState(dest, "", Domain.page_to_path(dest));

        $current = dest;

        if (cause_layout_switch && $layout_state !== "full") {
            $layout_state = "only-page";
        }

        set_domain_items(dest.domain);
    }

    window.onpopstate = (event: PopStateEvent) => {
        $current = event.state;
    };
</script>

<a href={Domain.page_to_path(dest)} on:click={navigate}> 
    <slot />
</a>