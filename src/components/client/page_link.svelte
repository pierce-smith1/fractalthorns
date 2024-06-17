<script lang="ts">
    import * as Domain from "../../descriptors/domain";
    import {current, layout_state} from "./page.ts";

    export let dest: Domain.Page;
    export let cause_layout_switch: boolean = false;

    function navigate(event: MouseEvent) {
        event.preventDefault();
        window.history.pushState(dest, "", Domain.page_to_path(dest));
        $current = dest;

        if (cause_layout_switch && $layout_state !== "full") {
            $layout_state = "only-page";
        }
    }

    window.onpopstate = (event: PopStateEvent) => {
        $current = event.state;
    };
</script>

<a href={Domain.page_to_path(dest)} on:click={navigate}> 
    <slot />
</a>