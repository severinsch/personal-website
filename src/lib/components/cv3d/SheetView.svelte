<script lang="ts">
	import { T } from '@threlte/core';
	import { HTML } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import type { ShelfLayout, Slot } from '$lib/content/cv3d-grid';
	import CVDetail from './CVDetail.svelte';
	import { cv } from './state.svelte';
	import { PX, sheetPose } from './framing';

	let { layout }: { layout: ShelfLayout } = $props();

	const slot = $derived(layout.slots.find((s) => s.item.id === cv.focused));
	let kept = $state<Slot | undefined>();
	$effect(() => {
		if (slot) kept = slot;
	});
	// keep showing the last sheet while it slides back in
	const last = $derived(kept ?? layout.slots[0]);

	// 0 = tucked inside the compartment, 1 = lifted out and presented
	const t = new Spring(0, { stiffness: 0.07, damping: 0.62 });
	let timer: ReturnType<typeof setTimeout> | undefined;
	$effect(() => {
		const show = !!slot;
		clearTimeout(timer);
		// let the flap drop before the sheet comes out
		if (show) timer = setTimeout(() => (t.target = 1), 260);
		else t.target = 0;
	});

	let h = $state(420);
	$effect(() => {
		cv.sheetPxH = h;
	});

	const pose = $derived(sheetPose(last, { w: cv.sheetPxW, h }));
	const k = $derived(Math.max(0, Math.min(1, t.current)));
	const lerp = (a: number, b: number) => a + (b - a) * k;
	const pos = $derived([lerp(last.x, pose.x), lerp(last.y, pose.y), lerp(-0.12, pose.z)] as [
		number,
		number,
		number
	]);

	// The sheet's DOM lives inside threlte's event target, and threlte raycasts from
	// event.offsetX/Y, which would be relative to whatever element on the sheet was hit, so it
	// would pick a door near the canvas's top-left corner. Keep the sheet's events to itself.
	// These must be native listeners: Svelte delegates `onclick` & co. to the app root, where
	// stopPropagation() comes too late, after threlte's listener has already seen the event.
	function isolate(el: HTMLElement) {
		const stop = (e: Event) => e.stopPropagation();
		// A plain click on the sheet closes the compartment, like a click anywhere else.
		// Selecting text (to copy it) or following a link doesn't.
		const onclick = (e: MouseEvent) => {
			e.stopPropagation();
			if ((e.target as HTMLElement).closest('a, button')) return;
			if (window.getSelection()?.toString()) return;
			cv.focused = null;
		};
		const events = ['pointerdown', 'pointerup', 'pointermove', 'dblclick', 'contextmenu', 'wheel'];
		for (const name of events) el.addEventListener(name, stop);
		el.addEventListener('click', onclick);
		return {
			destroy() {
				for (const name of events) el.removeEventListener(name, stop);
				el.removeEventListener('click', onclick);
			}
		};
	}
	function onpointerenter() {
		cv.hovered = null;
		document.body.style.cursor = '';
	}
</script>

<T.Group position={pos} rotation={[-0.05 * k, 0, pose.tilt * k]}>
	<HTML transform distanceFactor={PX * 400} pointerEvents={k > 0.6 ? 'auto' : 'none'}>
		<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
		<div
			class="sheet"
			data-cv-ui
			bind:clientHeight={h}
			use:isolate
			{onpointerenter}
			style="width: {cv.sheetPxW}px; opacity: {Math.min(1, k * 1.6)}; transform: scale({0.7 +
				0.3 * k})"
		>
			<CVDetail item={last.item} />
		</div>
	</HTML>
</T.Group>

<style>
	.sheet {
		padding: 2.25rem 2.5rem 2.5rem;
		background: #fbf8f2;
		border-radius: 2px;
		box-shadow:
			0 1px 0 rgba(0, 0, 0, 0.04),
			0 18px 40px -12px rgba(30, 20, 10, 0.35),
			0 4px 10px -4px rgba(30, 20, 10, 0.2);
		user-select: text;
	}
	/* dark mode: a dark sheet, like the rest of the site's surfaces */
	:global(html.dark) .sheet {
		background: #26211b;
		box-shadow:
			0 0 0 1px rgba(255, 240, 220, 0.06) inset,
			0 18px 40px -12px rgba(0, 0, 0, 0.6);
	}
</style>
