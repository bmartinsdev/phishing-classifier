<script lang="ts">
    export let state: boolean | null = null;
    export let type: string = "hidden";
</script>

<div
    class="transition-panel {type}"
    style="background-color: {state ? '#c45668' : '#56c46e'};"
>
    {#if state}
        <h1>PHISHING</h1>
    {:else}
        <h1>NOT PHISHING</h1>
    {/if}
</div>

<style lang="scss">
    .transition-panel {
        pointer-events: none;
        width: 100%;
        height: 100%;
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: #f5f7fa;
        z-index: 99;
        opacity: 0;
        transition: opacity 0.2s ease-in-out;
        text-transform: uppercase;
        h1 {
            font-size: 2rem;
            font-weight: 700;
        }
        &.preview {
            opacity: 0.2;
        }
        &.full {
            opacity: 1;
        }
    }
</style>
