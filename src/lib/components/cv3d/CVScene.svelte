<script lang="ts">
	import { T, useTask } from '@threlte/core';
	import { Text, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import ShelfFrame from './ShelfFrame.svelte';
	import ShelfDoor from './ShelfDoor.svelte';
	import {
		rows,
		totalHeight,
		VISIBLE_H,
		DEPTH,
		LEFT_X,
		DIVIDER_X,
		RIGHT_X
	} from '$lib/content/cv3d-grid';

	let { scrollProgress = 0 }: { scrollProgress?: number } = $props();

	interactivity();

	let camera: THREE.PerspectiveCamera | undefined = $state();

	// Camera moves vertically based on scroll
	const TOP_PAD = 2;
	const scrollRange = $derived(totalHeight - VISIBLE_H + TOP_PAD);
	const viewY = $derived(-VISIBLE_H / 2 + TOP_PAD - scrollProgress * scrollRange);
	const dateMidX = (LEFT_X + DIVIDER_X) / 2;

	useTask(() => {
		if (!camera) return;
		camera.position.set(0, viewY + 1.5, DEPTH + 10);
		camera.lookAt(0, viewY, 0);
	});
</script>

<!-- Camera (position managed in useTask) -->
<T.PerspectiveCamera bind:ref={camera} makeDefault fov={50} />

<!-- Lighting — multi-source for chrome -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[5, 8, 10]} intensity={1.2} />
<T.DirectionalLight position={[-4, 5, -5]} intensity={0.3} />
<T.PointLight position={[0, -totalHeight / 2, DEPTH + 6]} intensity={0.5} />

<!-- Chrome shelf frame (balls + tubes + panels) -->
<ShelfFrame />

<!-- Rows: doors for entries, labels for headers -->
{#each rows as row}
	{#if row.type === 'entry' && row.entry}
		<ShelfDoor entry={row.entry} centerY={row.centerY} height={row.height} />
	{/if}

	<!-- Section header label — WebGL text, left-aligned from divider, depth-tested by doors -->
	{#if row.type === 'header' && row.label}
		<Text
			text={row.label.toUpperCase()}
			font="/fonts/PlusJakartaSans-Bold.ttf"
			position={[DIVIDER_X + 0.15, row.centerY, DEPTH + 0.05]}
			fontSize={0.15}
			color="#6b5e52"
			anchorX="left"
			anchorY="middle"
			letterSpacing={0.12}
			maxWidth={RIGHT_X - DIVIDER_X - 0.3}
		/>
	{/if}

	<!-- Date/period label — WebGL text, centered in date column, depth-tested by doors -->
	{#if row.type === 'entry' && row.entry?.period}
		<Text
			text={row.entry.period}
			font="/fonts/Inter_24pt-Medium.ttf"
			position={[dateMidX, row.centerY, DEPTH + 0.05]}
			fontSize={0.13}
			color="#1a0f0f"
			anchorX="center"
			anchorY="middle"
			maxWidth={1.6}
			textAlign="center"
		/>
	{/if}
{/each}
