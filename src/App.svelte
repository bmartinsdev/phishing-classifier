<script lang="ts">
	import Phisher from "./modules/phisher/components/Phisher.svelte";
	import Tailwind from "./libraries/Tailwind.svelte";
	import { onMount } from "svelte";

	let ready = false;

	onMount(() => (ready = true));
</script>

{#if ready}
	<Phisher />
{/if}

<Tailwind />

<svelte:head>
	<!-- Fonts -->
	<link
		rel="stylesheet"
		href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,600,700"
	/>
</svelte:head>

<style lang="scss" global>
	@import "global.scss";
</style>
