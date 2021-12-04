<script lang="ts">
    import { CampaignType } from "../types";
    import PlainPreview from "./previews/PlainPreview.svelte";
    import HtmlPreview from "./previews/HtmlPreview.svelte";
    export let subject = "";
    export let type = 1;
    export let content = "";
    export let links = [];
</script>

<div
    class="card flex flex-col p-4 m-5 border-solid border-gray-200 border no-touch"
    id="active-card"
>
    {#if subject}
        <h5>Subject</h5>
        <p>{subject}</p>
    {/if}
    <h5>Campaign</h5>
    {#if type === CampaignType.html}
        <HtmlPreview {content} />
    {:else if type === CampaignType.plain}
        <PlainPreview {content} />
    {/if}
    {#if links}
        <h5>Domains</h5>
        {#each links as link}
            <p>{link}</p>
        {/each}
    {/if}
</div>

<style lang="scss">
    .card {
        position: absolute;
        box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.1);
        padding-bottom: 3rem;
        background-color: white;
        max-width: 600px;
        h5 {
            margin-top: 10px;
            font-weight: 700;
            font-size: 14px;
        }
        :global(.no-touch) {
            -webkit-touch-callout: none;
            -webkit-user-select: none;
            -khtml-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
            user-select: none;
        }
    }
</style>
