<script lang="ts">
    import * as Api from "../../../api/api"

    import KeyNav from "./keynav.svelte"

    let props: {
        tale: Api.TaleEntry
    } = $props();
</script>

<iframe class="frame" title={props.tale.title} src={props.tale.page_url}></iframe>

<KeyNav
    page_left={{domain: "discover"}}
    page_right={{domain: "subproject"}}
/>

<style>
    .frame {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
