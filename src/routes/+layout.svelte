<script lang="ts">
	import './layout.css';
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import AkariLamp from '$lib/components/AkariLamp.svelte';
	import PH5Lamp from '$lib/components/PH5Lamp.svelte';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

	let { children } = $props();
</script>

<div class="flex min-h-screen flex-col">
	<Nav />
	<main class="mx-auto w-full max-w-4xl flex-1 px-6 py-12">
		{@render children()}
	</main>
	<Footer />
</div>

<PH5Lamp />
<AkariLamp />