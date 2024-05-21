<script lang="ts">
    import * as Domain from "../../descriptors/domain";
    import {current} from "./page.ts";

    export let dest: Domain.Page;

    function navigate(event: MouseEvent) {
        event.preventDefault();
        window.history.pushState(dest, "", Domain.page_to_path(dest));
        $current = dest;
    }

    window.onpopstate = (event: PopStateEvent) => {
        $current = event.state;
    };
</script>

<a href={Domain.page_to_path(dest)} on:click={navigate}> 
    <slot/>
</a>