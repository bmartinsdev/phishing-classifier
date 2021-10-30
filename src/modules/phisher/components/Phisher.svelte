<script lang="ts">
    import { CardStore } from "../stores/Cards";
    import { onMount } from "svelte";
    import Card from "./Card.svelte";
    import Hammer from "hammerjs";
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
    const preload = 3;

    onMount(() => {
        board = document.getElementById("holder");
        reload();
    });

    // Retrieve cards until preload limit
    async function reload() {
        const newCards = [];
        for (let i = cards.length; i < preload; i++) {
            const pokemon = await CardStore.getPokemon();
            newCards.push(pokemon);
        }
        cards = [...cards, ...newCards];
        setTimeout(handle, 300);
    }

    // Hammer js implementation
    function handle() {
        result = null;
        cardElements = board.querySelectorAll(".card");
        topCard = cardElements[cardElements.length - 1];

        if (cardElements.length) {
            topCard.style.transform =
                "translateX(-50%) translateY(-50%) rotate(0deg) rotateY(0deg) scale(1)";
            if (hammer) hammer.destroy();
            hammer = new Hammer(topCard);
            hammer.add(
                new Hammer.Pan({
                    direction: Hammer.DIRECTION_ALL,
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
        let propY = e.deltaY / board.clientHeight;

        // get swipe direction, left (-1) or right (1)
        let dirX = e.deltaX < 0 ? -1 : 1;

        // get degrees of rotation, between 0 and +/- 45
        let deg = isDraggingFrom * dirX * Math.abs(propX) * 45;

        // move and rotate top card
        topCard.style.transform = `translateX(${posX}px) translateY(${posY}px) rotate(${deg}deg) rotateY(0deg) scale(1)`;
        topCard.style.transform = `translateX(${posX}px) translateY(${posY}px)`;

        if (e.isFinal) {
            isPanning = false;

            let swipped = false;

            if (
                [Hammer.DIRECTION_RIGHT, Hammer.DIRECTION_LEFT].includes(
                    e.direction
                )
            ) {
                if (posX > 0.25) {
                    swipped = true;
                    posX = board.clientWidth;
                } else if (posX < -0.25) {
                    swipped = true;
                    posX = -(board.clientWidth + topCard.clientWidth);
                }
            }
            if (swipped) {
                topCard.style.transform = `translateX(${posX}px) translateY(${posY}px) rotate(${deg}deg)`;
                setTimeout(() => rate(e.direction), 200);
            } else {
                topCard.style.transition = "transform 200ms ease-out";
                topCard.style.transform = "translateX(-50%) translateY(-50%)";
            }
        }
    }

    // Send report to api and shift array
    function rate(direction) {
        result = direction == Hammer.DIRECTION_LEFT;
        // Call api
        cards.shift();
        setTimeout(reload, 2000);
    }
</script>

<div id="holder">
    <div
        class="transition-panel {result != null
            ? result
                ? 'phishing'
                : 'safe'
            : ''}"
    >
        <h1>{result ? "PHISHING" : "NOT PHISHING"}</h1>
    </div>
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
        overflow: hidden;
        background-color: #f5f7fa;
    }
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
        &.phishing {
            opacity: 1;
            background-color: rgb(201, 89, 56);
        }
        &.safe {
            opacity: 1;
            background-color: rgb(81, 192, 81);
        }
        h1 {
            font-size: 2rem;
            font-weight: 700;
        }
    }
</style>
