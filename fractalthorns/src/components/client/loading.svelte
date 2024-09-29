<script lang="ts">
    import GlassPane from "./style/glass_pane.svelte";
</script>

<div class="spinner-spacefiller">
    <div class="spinner-pane-container">
        <GlassPane title={"loading"}>
            <div class="spinner-container">
                <img class="spinner" src="/assets/images/common/spinner.svg">
            </div>
        </GlassPane>
    </div>
</div>

<style>
    .spinner-spacefiller {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }

    .spinner-pane-container {
        z-index: 100;
        width: 64px;
        height: 70px;
    }

    .spinner-container {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
    }

    .spinner {
        filter: invert();
        width: 40px;
        height: 40px;
    }
</style>