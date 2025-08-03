<script lang="ts">
    import * as Svelte from "svelte"

    import * as Domain from "../../helpers/domain.ts"
    import * as Nav from "./nav.svelte.ts"
    import * as Page from "./page.svelte.ts"

    let {
        dest,
        cause_layout_switch = false,
        children,
    }: {
        dest: Domain.Page,
        cause_layout_switch?: boolean,
        children?: Svelte.Snippet,
    } = $props();

    async function navigate(event: MouseEvent) {
        event.preventDefault();

        window.history.pushState(JSON.stringify(dest), "", Domain.page_to_path(dest));

        const actual_dest = Nav.is_incomplete_page(dest)
            ? await Nav.get_landing_page(dest.domain)
            : dest;

        Page.state.current = actual_dest;

        if (cause_layout_switch && Page.state.layout !== "full") {
            Page.state.layout = "only-page";
        }

        Nav.set_domain_items(Nav.state, dest.domain);
    }

    window.onpopstate = (event: PopStateEvent) => {
        Page.state.current = JSON.parse(event.state);
    };
</script>

<a href={Domain.page_to_path(dest)} onclick={navigate}>
    {#if children}
        {@render children()}
    {/if}
</a>
