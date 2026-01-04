<script lang="ts">
    import * as Api from "../../../api/api"

    import * as Page from "../page.svelte.ts";

    import PageLink from "../page_link.svelte"

    let props: {
        tale: Api.TaleEntry
    } = $props();
</script>

<PageLink dest={{domain: "tale", name: props.tale.name}} cause_layout_switch>
    <div class="tale-button" class:selected={Page.state.current.domain === "tale" && Page.state.current.name === props.tale.name}>
        <div class="tale-icon-container">
            <img class="tale-icon" src={`/assets/images/common/tale-${props.tale.name}.png`} />
        </div>
        <div class="tale-text-container">
            <strong class="tale-title">{props.tale.title}</strong>
            <em class="tale-descr">{props.tale.description}</em>
        </div>
    </div>
</PageLink>

<style>
    .tale-title {
        font-size: 1.2em;
    }

    .tale-button {
        display: flex;
        flex-flow: row nowrap;
        align-items: center;
        gap: 8px;
        padding: 1em 0.5em;
        border: 1px solid rgba(255 255 255 / 50%);
        border-radius: 5px;
        transition: 0.3s background-color ease-out;
    }

    .tale-icon-container {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .tale-icon {
        align-self: stretch;
        object-fit: none;
    }

    .tale-button:hover, .selected {
        background-color: rgba(255 255 255 / 25%);
    }

    .tale-text-container {
        display: flex;
        flex-flow: column nowrap;
        gap: 0.5em;
    }
</style>
