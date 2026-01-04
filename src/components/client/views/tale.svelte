<script lang="ts">
    import * as Api from "../../../api/api"

    let props: {
        tale: Api.TaleEntry
    } = $props();
</script>

<iframe class="frame" title={props.tale.title} src={props.tale.page_url}></iframe>

<style>
    .frame {
        width: 100%;
        height: 100%;
        border: none;
    }
</style>
