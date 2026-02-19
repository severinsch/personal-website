<script lang="ts">
	import { Canvas } from '@threlte/core';
	import CVScene from '$lib/components/cv3d/CVScene.svelte';
	import { totalHeight, PX_PER_UNIT } from '$lib/content/cv3d-grid';

	let scrollY = $state(0);
	let innerHeight = $state(800);

	const totalScrollPx = $derived(totalHeight * PX_PER_UNIT + innerHeight);
	const maxScroll = $derived(totalScrollPx - innerHeight);
	const scrollProgress = $derived(Math.min(1, Math.max(0, scrollY / maxScroll)));
</script>

<svelte:head>
	<title>3D CV — Severin Schmidmeier</title>
	<meta name="description" content="Interactive 3D CV of Severin Schmidmeier — USM Haller shelf." />
</svelte:head>

<svelte:window onscroll={() => (scrollY = window.scrollY)} bind:innerHeight />

<div
	class="-mb-12 -mt-12"
	style="height: {totalScrollPx}px; margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw);"
>
	<div class="sticky top-0 h-screen">
		<Canvas>
			<CVScene {scrollProgress} />
		</Canvas>

		<!-- Overlay UI -->
		<div class="pointer-events-none absolute left-6 top-4">
			<h1 class="font-heading text-2xl font-bold text-espresso">Curriculum Vitae</h1>
			<p class="mt-1 text-sm text-clay">Scroll to navigate &middot; Click doors to reveal</p>
		</div>
	</div>
</div>
