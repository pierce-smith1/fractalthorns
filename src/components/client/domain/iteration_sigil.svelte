<script lang="ts">
    let props: {
        iteration?: string,
        large?: boolean,
        monochrome?: "dark" | "light",
    } = $props();
</script>

<div
    class="iteration-sigil"
    style:background-image={`url(/assets/images/common/iteration-${props.iteration ?? "0"}.png)`}
    class:large={props.large}
    class:monochrome-dark={props.monochrome === "dark"}
    class:monochrome-light={props.monochrome === "light"}
></div>

<style>
    .iteration-sigil {
        width: 12px;
        height: 12px;
        padding: 3px;
        background-size: contain;
    }

    .large {
        width: 20px;
        height: 20px;
    }

    .monochrome-dark {
        filter: grayscale() brightness(0);
    }

    .monochrome-light {
        filter: grayscale() brightness(100);
    }
</style>
