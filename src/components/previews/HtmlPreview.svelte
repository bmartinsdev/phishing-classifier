<script lang="ts">
    export let content;

    function handleClick(e: Event) {
        e.preventDefault();
    }
</script>

<div class="html-holder no-touch" on:click={handleClick}>{@html content}</div>

<style lang="scss">
    .html-holder {
        pointer-events: none;
        overflow-x: hidden;
    }
</style>
