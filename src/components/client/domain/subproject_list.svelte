<script lang="ts">
    import * as Subproject from "../../../descriptors/subproject";
    import SubprojectButton from "./subproject_button.svelte";
</script>

<div class="subproject-list">
    <div class="subprojects-buttons">
        {#each Subproject.subprojects as subproject}
            <SubprojectButton {subproject} />
        {/each}
    </div>
    <div class="socials-links">
        <a class="link gh-link" href="https://github.com/pierce-smith1">
            <img src="/assets/images/common/socials-github.png" />
        </a>
        <a class="link yt-link" href="https://www.youtube.com/@berylrose2270">
            <img src="/assets/images/common/socials-youtube.png" />
        </a>
    </div>
</div>

<style>
    .subproject-list {
        height: 100%;
        display: flex;
        flex-flow: column nowrap;
        justify-content: space-between;
        padding-bottom: 10px;
    }

    .socials-links {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
    }
</style>