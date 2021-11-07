<script lang="ts">
    import { CampaignStore } from "../stores/Campaigns";
    import { tick, onMount } from "svelte";
    import Overlay from "./Overlay.svelte";
    import { TouchedJs } from "../lib/Touched";
    import Card from "./Card.svelte";
    import type { Campaign } from "../types";

    let cards: Campaign[] = [];
    let activeCard: Campaign;
    let activeCardEl: HTMLElement;
    let boardEl: HTMLElement;
    const preload = 3;

    onMount(async () => {
        activeCard = await CampaignStore.getCampaign();
        boardEl = document.getElementById("holder");

        listen();
        preloadCards();
    });

    // Retrieve cards until preload limit
    async function preloadCards() {
        const newCards = [];
        for (let i = cards.length; i < preload; i++) {
            const campaign: Campaign = await CampaignStore.getCampaign();
            newCards.push(campaign);
        }
        cards = [...cards, ...newCards];
    }

    async function listen() {
        await tick();
        activeCardEl = document.getElementById("active-card");
        const touched = new TouchedJs(activeCardEl);
        activeCardEl.addEventListener("pan", (customEvent) => {
            const event = customEvent.detail.e;
            const pos = customEvent.detail.pos;

            let bounds = activeCardEl.getBoundingClientRect();
            let isDraggingFrom =
                event.screenY / 2 - bounds.top > activeCardEl.clientHeight / 2
                    ? -1
                    : 1;

            // get ratio between swiped pixels and the axes
            let propX = pos.x / boardEl.clientWidth;

            // get swipe direction, left (-1) or right (1)
            let dirX = pos.x < 0 ? -1 : 1;

            // get degrees of rotation, between 0 and +/- 45
            let deg = isDraggingFrom * dirX * Math.abs(propX) * 45;

            // move and rotate top card
            activeCardEl.style.transform = `translateX(${pos.x}px) rotate(${deg}deg) rotateY(0deg) scale(1)`;
        });
    }
</script>

<div id="holder">
    {#if activeCard}
        <Card {...activeCard} />
    {/if}
</div>

<style lang="scss">
    #holder {
        width: 100%;
        height: 100vh;
        position: relative;
        background-color: #f5f7fa;
    }
</style>
