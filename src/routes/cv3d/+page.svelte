<script lang="ts">
	import { Canvas } from '@threlte/core';
	import CVScene from '$lib/components/cv3d/CVScene.svelte';
</script>

<svelte:head>
	<title>3D CV — Severin Schmidmeier</title>
	<meta name="description" content="Interactive 3D CV of Severin Schmidmeier — USM Haller shelf." />
	<!-- Hide decorative lamps on this full-screen 3D page -->
	<style>
		#lamp-akari,
		#lamp-ph5 {
			opacity: 0 !important;
			pointer-events: none !important;
		}
	</style>
</svelte:head>

<div
	class="-mt-12 -mb-12"
	style="margin-left: calc(50% - 50vw); margin-right: calc(50% - 50vw)"
>
	<div style="height: 100vh; position: relative;">
		<Canvas>
			<CVScene />
		</Canvas>

		<!-- Overlay UI -->
		<div class="pointer-events-none absolute top-4 left-6">
			<h1 class="font-heading text-2xl font-bold text-espresso">Curriculum Vitae</h1>
			<p class="mt-1 text-sm text-clay">Click doors to reveal</p>
		</div>
	</div>
</div>
