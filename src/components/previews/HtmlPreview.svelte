<script lang="ts">
    export let content;

    function handleClick(e: Event) {
        e.preventDefault();
        console.log(e.target);
    }
</script>

<div class="html-holder" on:click={handleClick}>{@html content}</div>

<style lang="scss">
    .html-holder {
        pointer-events: none;
    }
</style>
