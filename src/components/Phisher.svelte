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
    const panning = {
        pos: {
            start: {
                x: 0,
                y: 0,
            },
            current: {
                x: 0,
                y: 0,
            },
        },
        state: null,
        screenWidth: 0,
        threshold: 0.2,
        result: "hidden",
    };

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

    // Retrieve cards until preload limit
    async function classify() {
        // call api
        await setTimeout(() => {
            panning.result = "full";

            setTimeout(() => {
                panning.result = "hidden";
                activeCardEl.style.transform = `unset`;
            }, 2000);
        }, 200);
    }

    async function listen() {
        await tick();
        activeCardEl = document.getElementById("active-card");
        const touched = new TouchedJs(activeCardEl);
        const style = window.getComputedStyle(activeCardEl);
        const mx = style.transform.match(/^matrix\((.+)\)$/);
        panning.pos.start.x = mx ? parseFloat(mx[1].split(", ")[4]) : 0;

        activeCardEl.addEventListener("pan", (customEvent) => {
            const event = customEvent.detail.e;
            panning.pos.current = customEvent.detail.pos;

            let posX = panning.pos.current.x - panning.pos.start.x;
            const trigger = panning.screenWidth * panning.threshold;

            if (Math.abs(posX) > trigger) {
                panning.state = posX > 0 ? true : false;
                panning.result = "preview";
            } else {
                panning.result = "hidden";
            }

            // move and rotate top card
            activeCardEl.style.transform = `translateX(${posX}px)`;
        });

        activeCardEl.addEventListener("end", (customEvent) => {
            activeCardEl.style.transition = "transform 200ms ease-in-out";
            if (panning.result === "preview") {
                const swipe = panning.state
                    ? boardEl.clientWidth
                    : -boardEl.clientWidth;
                activeCardEl.style.transform = `translateX(${swipe}px`;
                panning.result = "hidden";
                classify();
            } else {
                activeCardEl.style.transform = "unset";
            }
        });

        activeCardEl.addEventListener("start", (customEvent) => {
            panning.screenWidth = Math.max(
                document.documentElement.clientWidth,
                document.body.scrollWidth,
                document.documentElement.scrollWidth,
                document.body.offsetWidth,
                document.documentElement.offsetWidth
            );
            activeCardEl.style.transition = "unset";
            panning.pos.start = customEvent.detail.pos;
            panning.state = null;
        });
    }
</script>

<div id="holder">
    {#if activeCard}
        <Card {...activeCard} />
    {/if}
    {#if panning.state !== null}
        <Overlay state={panning.state} type={panning.result} />
    {/if}
</div>

<style lang="scss">
    #holder {
        width: 100%;
        height: 100vh;
        position: relative;
        background-color: #f5f7fa;
        overflow-x: hidden;
        justify-content: center;
        display: flex;
    }
</style>
