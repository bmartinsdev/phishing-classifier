<script lang="ts">
    import { CampaignStore } from "../stores/Campaigns";
    import { onMount } from "svelte";
    import Overlay from "./Overlay.svelte";
    import Card from "./Card.svelte";
    import Hammer from "hammerjs";
    import type { Campaign } from "../types";

    let cards = [],
        board,
        cardElements,
        topCard,
        nextCard,
        hammer,
        isPanning = false,
        isDraggingFrom,
        startPosX,
        startPosY,
        result;
    const preload = 1;

    onMount(() => {
        board = document.getElementById("holder");
        reload();
    });

    // Retrieve cards until preload limit
    async function reload() {
        const newCards = [];
        for (let i = cards.length; i < preload; i++) {
            const campaign: Campaign = await CampaignStore.getCampaign();
            newCards.push(campaign);
        }
        cards = [...cards, ...newCards];
        setTimeout(handle, 300);
    }

    // Hammer js implementation
    function handle() {
        result = {
            opacity: 0,
            phishing: true,
        };
        cardElements = board.querySelectorAll(".card");
        topCard = cardElements[cardElements.length - 1];

        if (cardElements.length) {
            if (hammer) hammer.destroy();
            hammer = new Hammer(topCard);
            hammer.add(
                new Hammer.Pan({
                    direction: Hammer.DIRECTION_HORIZONTAL,
                    threshold: 0,
                })
            );

            hammer.on("pan", onPan);
        }
    }

    function onPan(e) {
        if (!isPanning) {
            isPanning = true;
            topCard.style.transition = null;
            if (nextCard) nextCard.style.transition = null;

            // Starting pos
            const style = window.getComputedStyle(topCard);
            const mx = style.transform.match(/^matrix\((.+)\)$/);

            startPosX = mx ? parseFloat(mx[1].split(", ")[4]) : 0;
            startPosY = mx ? parseFloat(mx[1].split(", ")[5]) : 0;

            let bounds = topCard.getBoundingClientRect();

            isDraggingFrom =
                e.center.y - bounds.top > topCard.clientHeight / 2 ? -1 : 1;
        }

        // Get new pos and move card
        let posX = e.deltaX + startPosX;
        let posY = e.deltaY + startPosY;

        // get ratio between swiped pixels and the axes
        let propX = e.deltaX / board.clientWidth;
        console.log(posX);

        // get swipe direction, left (-1) or right (1)
        let dirX = e.deltaX < 0 ? -1 : 1;

        // get degrees of rotation, between 0 and +/- 45
        let deg = isDraggingFrom * dirX * Math.abs(propX) * 45;

        // move and rotate top card
        topCard.style.transform = `translateX(${posX}px) translateY(${posY}px) rotate(${deg}deg) rotateY(0deg) scale(1)`;

        if (e.isFinal) {
            isPanning = false;

            let swipped = false;

            if (
                [Hammer.DIRECTION_RIGHT, Hammer.DIRECTION_LEFT].includes(
                    e.direction
                )
            ) {
                if (posX > 1) {
                    swipped = true;
                    posX = board.clientWidth;
                } else if (posX < -1) {
                    swipped = true;
                    posX = -(board.clientWidth + topCard.clientWidth);
                }
            }
            if (swipped) {
                topCard.style.transform = `translateX(${posX}px) translateY(${posY}px) rotate(${deg}deg)`;
                setTimeout(() => rate(e.direction), 200);
            } else {
                topCard.style.transition = "transform 200ms ease-out";
                topCard.style.transform = "unset";
            }
        }
    }

    // Send report to api and shift array
    function rate(direction) {
        result = {
            opacity: 100,
            phishing: direction == Hammer.DIRECTION_LEFT,
        };
        // Call api
        cards.shift();
        setTimeout(reload, 500);
    }
</script>

<div id="holder">
    <Overlay {...result} />
    {#if cards.length}
        {#each cards as card}
            <Card {...card} />
        {/each}
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
