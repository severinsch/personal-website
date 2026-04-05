<script lang="ts">
	import { T } from '@threlte/core';
	import { Text, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import ShelfFrame from './ShelfFrame.svelte';
	import ShelfDoor from './ShelfDoor.svelte';
	import { columns, maxHeight, DEPTH } from '$lib/content/cv3d-grid';

	interactivity();

	let camera: THREE.PerspectiveCamera | undefined = $state();

	// Elevated upper-left camera so the top surfaces of the shelf are visible
	const CENTER_Y = -maxHeight / 2;

	$effect(() => {
		if (!camera) return;
		camera.position.set(-2, 1, DEPTH + 10);
		camera.lookAt(0, CENTER_Y, 0);
	});
</script>

<T.PerspectiveCamera bind:ref={camera} makeDefault fov={60} />

<!-- Lighting — extra upper-left key light to illuminate the coloured top plates -->
<T.AmbientLight intensity={0.5} />
<T.DirectionalLight position={[5, 8, 10]} intensity={1.0} />
<T.DirectionalLight position={[-6, 8, 6]} intensity={0.9} />
<T.DirectionalLight position={[-4, 5, -5]} intensity={0.2} />
<T.PointLight position={[0, CENTER_Y, DEPTH + 8]} intensity={0.5} />

<ShelfFrame />

<!-- Per-column rows -->
{#each columns as col}
	{#each col.rows as row}
		{#if row.type === 'entry' && row.entry}
			<ShelfDoor
				entry={row.entry}
				centerY={row.centerY}
				height={row.height}
				leftX={col.leftX}
				rightX={col.rightX}
			/>
		{/if}

		{#if row.type === 'header' && row.label}
			<Text
				text={row.label.toUpperCase()}
				font="/fonts/PlusJakartaSans-Bold.ttf"
				position={[(col.leftX + col.rightX) / 2, row.centerY, DEPTH + 0.05]}
				fontSize={0.16}
				color="#6b5e52"
				anchorX="center"
				anchorY="middle"
				letterSpacing={0.1}
				maxWidth={col.rightX - col.leftX - 0.4}
			/>
		{/if}
	{/each}
{/each}
