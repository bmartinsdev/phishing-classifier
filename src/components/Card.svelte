<script lang="ts">
    import { CampaignType } from "../types";
    import PlainPreview from "./previews/PlainPreview.svelte";
    import HtmlPreview from "./previews/HtmlPreview.svelte";
    export let subject;
    export let type;
    export let content;
</script>

<div class="card flex flex-col p-4 m-5 border-solid border-gray-200 border">
    <h4 class="w-full text-2xl text-black mb-1.5 capitalize my-4">
        {subject}
    </h4>
    {#if type === CampaignType.html}
        <HtmlPreview {content} />
    {:else if type === CampaignType.plain}
        <PlainPreview {content} />
    {/if}
</div>

<style lang="scss">
    .card {
        width: 90%;
        position: absolute;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        background-color: white;
    }
</style>
