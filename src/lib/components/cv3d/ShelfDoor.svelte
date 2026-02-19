<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import type { ShelfEntry } from '$lib/content/cv3d-grid';
	import { CONTENT_COL_W, DIVIDER_X, RIGHT_X, DEPTH } from '$lib/content/cv3d-grid';

	let {
		entry,
		centerY,
		height
	}: {
		entry: ShelfEntry;
		centerY: number;
		height: number;
	} = $props();

	const rotX = new Spring(0, { stiffness: 0.08, damping: 0.6 });
	const textOpacity = new Spring(0, { stiffness: 0.05, damping: 0.8 });

	let open = $state(false);

	$effect(() => {
		rotX.set(open ? Math.PI / 2 : 0);
		textOpacity.set(open ? 1 : 0);
	});

	const contentCenterX = $derived((DIVIDER_X + RIGHT_X) / 2);
	const doorW = CONTENT_COL_W - 0.1;
	const doorH = $derived(height - 0.08);
	const hingeY = $derived(centerY - height / 2 + 0.04);

	// Content layout (world units). Text lives at z = DEPTH - 0.05, just behind the closed
	// door's back face — depth testing naturally reveals it as the door swings open.
	const PAD_H = 0.18;
	const PAD_V = 0.14;
	const FONT_TITLE = 0.17;
	const FONT_SUB = 0.13;
	const FONT_BULLET = 0.12;
	const LINE_TITLE = 0.25;
	const LINE_SUB = 0.19;
	const contentLeft = DIVIDER_X + PAD_H;
	const contentW = RIGHT_X - DIVIDER_X - PAD_H * 2;
	const contentZ = DEPTH - 0.05;

	const contentTop = $derived(centerY + doorH / 2 - PAD_V);

	const subtitleText = $derived(
		entry.subtitle && entry.location
			? `${entry.subtitle}  ·  ${entry.location}`
			: (entry.subtitle ?? entry.location ?? '')
	);

	const bulletsStartY = $derived(contentTop - LINE_TITLE - (subtitleText ? LINE_SUB + 0.08 : 0.05));

	// Single text block for all bullets joined with newlines — Troika handles all wrapping
	// and line spacing internally, so bullet positions are always exact.
	const bulletsText = $derived(entry.bullets.map((b) => `• ${b}`).join('\n'));

	// colorRanges colors each "•" with entry.color, bullet text with dark color.
	// Keys are character indices where a color change starts.
	const bulletsColorRanges = $derived.by(() => {
		const ranges: Record<number, string> = {};
		let idx = 0;
		for (let i = 0; i < entry.bullets.length; i++) {
			ranges[idx] = entry.color; // "•"
			ranges[idx + 2] = '#1a0f0f'; // bullet text (after "• ")
			idx += 2 + entry.bullets[i].length;
			if (i < entry.bullets.length - 1) idx += 1; // "\n"
		}
		return ranges;
	});
</script>

<!-- Door hinge group — bottom edge pivot, rotates around X axis (drops forward) -->
<T.Group position={[contentCenterX, hingeY, DEPTH + 0.02]} rotation.x={rotX.current}>
	<!-- Door panel -->
	<T.Mesh
		position={[0, doorH / 2, 0]}
		onclick={(e: { stopPropagation: () => void }) => {
			e.stopPropagation();
			open = !open;
		}}
		onpointerenter={() => (document.body.style.cursor = 'pointer')}
		onpointerleave={() => (document.body.style.cursor = 'auto')}
	>
		<T.BoxGeometry args={[doorW, doorH, 0.04]} />
		<T.MeshStandardMaterial color={entry.color} roughness={0.3} metalness={0.1} />
	</T.Mesh>

	<!-- Flat disk knob with knurled edge — near top of door -->
	<T.Group position={[0, doorH * 0.82, 0.035]} rotation.x={Math.PI / 2}>
		<!-- Chrome disk face -->
		<T.Mesh>
			<T.CylinderGeometry args={[0.055, 0.055, 0.012, 32]} />
			<T.MeshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.15} />
		</T.Mesh>
		<!-- Knurled outer ring -->
		<T.Mesh>
			<T.TorusGeometry args={[0.055, 0.009, 6, 32]} />
			<T.MeshStandardMaterial color="#b0b0b0" metalness={0.85} roughness={0.45} />
		</T.Mesh>
	</T.Group>
</T.Group>

<!-- Content text — WebGL, depth-tested by door geometry.
     z = DEPTH - 0.05 puts it just behind the closed door's back face so the door
     physically occludes it. As the door swings open the text is revealed naturally. -->
<Text
	text={entry.title}
	font="/fonts/PlusJakartaSans-Bold.ttf"
	position={[contentLeft, contentTop, contentZ]}
	fontSize={FONT_TITLE}
	color="#0f0808"
	anchorX="left"
	anchorY="top"
	maxWidth={contentW}
	fillOpacity={textOpacity.current}
/>

{#if subtitleText}
	<Text
		text={subtitleText}
		font="/fonts/Inter_18pt-Medium.ttf"
		position={[contentLeft, contentTop - LINE_TITLE, contentZ]}
		fontSize={FONT_SUB}
		color="#3d2a1a"
		anchorX="left"
		anchorY="top"
		maxWidth={contentW}
		fillOpacity={textOpacity.current}
	/>
{/if}

{#if entry.bullets.length > 0}
	<Text
		text={bulletsText}
		font="/fonts/Inter_18pt-Medium.ttf"
		position={[contentLeft, bulletsStartY, contentZ]}
		fontSize={FONT_BULLET}
		anchorX="left"
		anchorY="top"
		maxWidth={contentW}
		lineHeight={1.4}
		colorRanges={bulletsColorRanges}
		fillOpacity={textOpacity.current}
	/>
{/if}
