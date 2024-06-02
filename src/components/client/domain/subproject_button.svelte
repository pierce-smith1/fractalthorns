<script lang="ts">
    import * as Subproject from "../../../descriptors/subproject";

    import {current} from "../page";

    import PageLink from "../page_link.svelte";

    export let subproject: Subproject.Model;
</script>

<PageLink dest={{domain: "subproject", name: subproject.name}}>
    <div class="subproject-button" class:selected={$current.domain === "subproject" && $current.name === subproject.name}>
        <div class="subproject-icon-container">
            <img class="subproject-icon" src={`/assets/images/common/subproject-${subproject.name}.png`} />
        </div>
        <div class="subproject-text-container">
            <h4 class="subproject-title">{subproject.title}</h4>
            <p class="subproject-descr">{subproject.description}</p>
        </div>
    </div>
</PageLink>

<style> 
    .subproject-button {
        display: flex;
        flex-flow: row nowrap;
        gap: 8px;
        border: 1px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        padding: 10px;
        transition: 0.3s background-color ease-out;
    }

    .subproject-icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .subproject-button:hover, .selected {
        background-color: rgba(255 255 255 / 25%);
    }

    .subproject-icon-container {

    }

    .subproject-text-container {
        display: flex;
        flex-flow: column nowrap;
    }

    p, h4 {
        padding: 0;
        margin: 0;
    }
</style>