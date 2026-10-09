<script lang="ts">
	import { Canvas } from '@threlte/core';
	import { NeutralToneMapping, PCFShadowMap } from 'three';
	import { fly, fade } from 'svelte/transition';
	import { onMount } from 'svelte';
	import CVScene from '$lib/components/cv3d/CVScene.svelte';
	import { cv, input, lowPower, neighbour } from '$lib/components/cv3d/state.svelte';
	import { buildLayout, sections, sectionOrder } from '$lib/content/cv3d-grid';

	let W = $state(0);
	let H = $state(0);
	let top = $state(64);
	// The 3D view only runs on the client; after a second lost context we give up and fall back
	let mounted = $state(false);
	const live = $derived(mounted && cv.losses < 2);
	$effect(() => {
		if (!live) cv.focused = null;
	});

	const orientation = $derived(W && H && W / H < 1.05 ? 'portrait' : 'landscape');
	const layout = $derived(buildLayout(orientation));
	const focusedItem = $derived(layout.slots.find((s) => s.item.id === cv.focused)?.item);

	onMount(() => {
		mounted = true;
		cv.sheetPxW = Math.min(560, window.innerWidth - 40);
		const measure = () => {
			top = document.querySelector('nav')?.getBoundingClientRect().bottom ?? 64;
			cv.sheetPxW = Math.min(560, window.innerWidth - 40);
		};
		measure();
		window.addEventListener('resize', measure);
		const prevOverflow = document.documentElement.style.overflow;
		document.documentElement.style.overflow = 'hidden';
		return () => {
			window.removeEventListener('resize', measure);
			document.documentElement.style.overflow = prevOverflow;
			document.body.style.cursor = '';
			cv.focused = null;
			cv.hovered = null;
			cv.losses = 0;
		};
	});

	function go(dir: 'prev' | 'next' | 'up' | 'down') {
		cv.focused = neighbour(layout, cv.focused ?? layout.slots[0].item.id, dir);
	}

	function onkeydown(e: KeyboardEvent) {
		if (e.target instanceof HTMLElement && e.target.closest('input, textarea')) return;
		const map: Record<string, 'prev' | 'next' | 'up' | 'down'> = {
			ArrowLeft: 'prev',
			ArrowRight: 'next',
			ArrowUp: 'up',
			ArrowDown: 'down'
		};
		if (e.key === 'Escape') cv.focused = null;
		else if (map[e.key]) {
			e.preventDefault();
			if (!cv.focused) cv.focused = layout.slots[0].item.id;
			else go(map[e.key]);
		} else if (e.key === 'Enter' && cv.hovered && !cv.focused) cv.focused = cv.hovered;
	}

	// ── Pointer: parallax + drag to look around ──
	let down: { x: number; y: number; yaw: number; pitch: number } | null = null;
	let dragging = $state(false);
	function onpointerdown(e: PointerEvent) {
		if ((e.target as HTMLElement).closest('[data-cv-ui]')) return;
		down = { x: e.clientX, y: e.clientY, yaw: input.dragYaw, pitch: input.dragPitch };
		input.wasDrag = false;
		input.doorClicked = false;
	}
	function onpointermove(e: PointerEvent) {
		input.px = (e.clientX / window.innerWidth) * 2 - 1;
		input.py = ((e.clientY - top) / H) * 2 - 1;
		if (!down) return;
		const dx = e.clientX - down.x;
		const dy = e.clientY - down.y;
		if (!input.wasDrag && Math.hypot(dx, dy) > 5) {
			input.wasDrag = true;
			input.dragging = dragging = true;
		}
		if (input.dragging) {
			input.dragYaw = Math.max(-0.75, Math.min(0.75, down.yaw - dx * 0.004));
			input.dragPitch = Math.max(-0.12, Math.min(0.45, down.pitch + dy * 0.003));
		}
	}
	function onpointerup() {
		down = null;
		input.dragging = dragging = false;
	}
	function onclick(e: MouseEvent) {
		// a click on empty space closes the open compartment
		if ((e.target as HTMLElement).closest('[data-cv-ui]')) return;
		if (!input.doorClicked && !input.wasDrag) cv.focused = null;
		input.doorClicked = false;
	}
</script>

<svelte:head>
	<title>3D CV — Severin Schmidmeier</title>
	<meta
		name="description"
		content="Interactive 3D CV of Severin Schmidmeier — a USM Haller sideboard."
	/>
	<link rel="canonical" href="https://schmidmeier.dev/cv3d" />
	<style>
		#lamp-akari,
		#lamp-ph5,
		footer {
			display: none !important;
		}
		/* the page fade-in leaves a transform on <main>, which would trap position: fixed */
		main {
			animation: none !important;
		}
	</style>
</svelte:head>

<svelte:window {onkeydown} {onpointerup} onpointercancel={onpointerup} />

<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div
	class="stage fixed inset-x-0 bottom-0 overflow-hidden select-none"
	style="top: {top}px"
	bind:clientWidth={W}
	bind:clientHeight={H}
	{onpointerdown}
	{onpointermove}
	{onclick}
>
	<div class="absolute inset-0" class:grabbing={dragging}>
		{#if live}
			<!-- a lost context gets one retry on a fresh canvas -->
			{#key cv.losses}
				<!-- WebGL unavailable (e.g. hardware acceleration off): the renderer throws -->
				<svelte:boundary onerror={(e) => console.error(e)}>
					<Canvas
						toneMapping={NeutralToneMapping}
						shadows={lowPower ? false : PCFShadowMap}
						autoRender={cv.compiled}
						dpr={Math.min(lowPower ? 1.5 : 2, globalThis.devicePixelRatio ?? 1)}
					>
						<CVScene {layout} />
					</Canvas>
					{#snippet failed()}
						{@render noWebgl()}
					{/snippet}
				</svelte:boundary>
			{/key}
		{:else if mounted}
			{@render noWebgl()}
		{/if}
	</div>

	{#snippet noWebgl()}
		<div class="flex h-full flex-col items-center justify-center gap-3 px-6 text-center">
			<p class="max-w-md text-walnut">
				{cv.losses
					? 'Your device’s graphics driver stopped the 3D shelf.'
					: 'The 3D shelf needs WebGL, which your browser couldn’t start (hardware acceleration may be turned off).'}
			</p>
			{#if cv.losses}
				<button
					data-cv-ui
					class="text-clay transition-colors hover:text-mustard"
					onclick={() => (cv.losses = 0)}>Try again</button
				>
			{/if}
			<a href="/cv" class="text-clay transition-colors hover:text-mustard"
				>Read the text version →</a
			>
		</div>
	{/snippet}

	<!-- Header -->
	<header
		class="pointer-events-none absolute top-6 left-6 transition-opacity duration-300 sm:top-8 sm:left-8"
		class:opacity-0={!!cv.focused}
	>
		<h1 class="font-heading text-2xl font-bold tracking-tight text-espresso sm:text-3xl">
			Curriculum Vitae
		</h1>
	</header>
	<nav
		data-cv-ui
		class="absolute top-6 right-6 flex items-center gap-4 text-sm transition-opacity duration-300 sm:top-8 sm:right-8"
		class:opacity-0={!!cv.focused}
	>
		<a href="/cv" class="text-clay transition-colors hover:text-mustard">Text version</a>
	</nav>

	<!-- Legend -->
	{#if live && !cv.focused}
		<div
			data-cv-ui
			class="legend absolute bottom-5 left-1/2 flex -translate-x-1/2 flex-wrap justify-center gap-x-5 gap-y-1 text-[0.8rem] whitespace-nowrap text-walnut/75"
			transition:fade={{ duration: 150 }}
		>
			{#each sectionOrder as id}
				{@const s = sections[id]}
				<button
					class="flex items-center gap-1.5 transition-colors hover:text-espresso"
					class:text-espresso={cv.section === id}
					onmouseenter={() => (cv.section = id)}
					onmouseleave={() => (cv.section = null)}
					onfocus={() => (cv.section = id)}
					onblur={() => (cv.section = null)}
					onclick={() =>
						(cv.focused = layout.slots.find((sl) => sl.item.section === id)?.item.id ?? null)}
				>
					<span
						class="h-2.5 w-2.5 rounded-full"
						style="background: {s.color}; box-shadow: 0 0 0 1px color-mix(in srgb, var(--color-walnut) 28%, transparent)"
					></span>
					{s.label}
				</button>
			{/each}
		</div>
	{/if}

	{#if live && !cv.focused}
		<p
			class="pointer-events-none absolute bottom-5 left-6 hidden text-xs text-clay lg:block"
			transition:fade={{ duration: 150 }}
		>
			Click a door · drag to look around · arrow keys to browse
		</p>
	{/if}

	<!-- Controls under the sheet -->
	{#if focusedItem}
		<div
			data-cv-ui
			class="pill absolute bottom-5 left-1/2 flex -translate-x-1/2 items-center gap-1"
			transition:fly={{ y: 20, duration: 250 }}
		>
			<button class="ctl" onclick={() => go('prev')} aria-label="Previous">←</button>
			<button class="ctl" onclick={() => (cv.focused = null)}>Close</button>
			<button class="ctl" onclick={() => go('next')} aria-label="Next">→</button>
		</div>
	{/if}

	<!-- Screen readers / no-WebGL: the content as plain text -->
	<ul class="sr-only">
		{#each layout.slots as s}
			<li>
				{sections[s.item.section].label}: {s.item.title}{s.item.subtitle
					? `, ${s.item.subtitle}`
					: ''}
			</li>
		{/each}
	</ul>
</div>

<style>
	.stage {
		cursor: grab;
		touch-action: pan-y;
	}
	.grabbing {
		cursor: grabbing;
	}
	.ctl {
		display: inline-flex;
		align-items: center;
		gap: 0.4rem;
		padding: 0.35rem 0.75rem;
		border-radius: 999px;
		font-size: 0.85rem;
		color: var(--color-walnut);
		transition: background 0.15s;
		cursor: pointer;
	}
	.ctl:hover {
		background: color-mix(in srgb, var(--color-walnut) 8%, transparent);
	}
	.pill {
		padding: 0.25rem;
		border-radius: 999px;
		background: color-mix(in srgb, var(--color-cream) 85%, transparent);
		backdrop-filter: blur(10px);
		border: 1px solid color-mix(in srgb, var(--color-walnut) 12%, transparent);
		cursor: auto;
	}
	.legend {
		cursor: auto;
	}
</style>
