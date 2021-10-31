<script lang="ts">
    export let phishing: boolean = true;
    export let opacity: Number = 0;
</script>

<div
    class="transition-panel"
    style="background-color: {phishing
        ? '#c45668'
        : '#56c46e'}; opacity: {opacity}"
>
    {#if phishing}
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
        transition: opacity 0.4ms ease-in-out;
        text-transform: uppercase;
        h1 {
            font-size: 2rem;
            font-weight: 700;
        }
    }
</style>
