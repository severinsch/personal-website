<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import type { ShelfEntry } from '$lib/content/cv3d-grid';
	import { DEPTH } from '$lib/content/cv3d-grid';

	let {
		entry,
		centerY,
		height,
		leftX,
		rightX
	}: {
		entry: ShelfEntry;
		centerY: number;
		height: number;
		leftX: number;
		rightX: number;
	} = $props();

	const rotX = new Spring(0, { stiffness: 0.08, damping: 0.6 });
	const textOpacity = new Spring(0, { stiffness: 0.05, damping: 0.8 });

	let open = $state(false);

	$effect(() => {
		rotX.set(open ? Math.PI / 2 : 0);
		textOpacity.set(open ? 1 : 0);
	});

	const doorCenterX = $derived((leftX + rightX) / 2);
	const doorW = $derived(rightX - leftX - 0.1);
	const doorH = $derived(height - 0.08);
	const hingeY = $derived(centerY - height / 2 + 0.04);

	// Content layout — text lives at z = DEPTH - 0.05, just behind the closed door's back face
	const PAD_H = 0.18;
	const PAD_V = 0.14;
	const FONT_TITLE = 0.17;
	const FONT_SUB = 0.13;
	const FONT_BULLET = 0.12;
	const LINE_TITLE = 0.26;
	const LINE_SUB = 0.19;

	const contentLeft = $derived(leftX + PAD_H);
	const contentW = $derived(rightX - leftX - PAD_H * 2);
	const contentZ = DEPTH - 0.05;

	const contentTop = $derived(centerY + doorH / 2 - PAD_V);

	const subtitleText = $derived(
		entry.subtitle && entry.location
			? `${entry.subtitle}  ·  ${entry.location}`
			: (entry.subtitle ?? entry.location ?? '')
	);

	// Y positions for each text element
	const periodY = $derived(contentTop - LINE_TITLE);
	const subtitleY = $derived(periodY - (entry.period ? LINE_SUB : 0));
	const bulletsStartY = $derived(subtitleY - (subtitleText ? LINE_SUB + 0.08 : 0.05));

	// Bullet block with colour ranges
	const bulletsText = $derived(entry.bullets.map((b) => `• ${b}`).join('\n'));

	const bulletsColorRanges = $derived.by(() => {
		const ranges: Record<number, string> = {};
		let idx = 0;
		for (let i = 0; i < entry.bullets.length; i++) {
			ranges[idx] = entry.color; // "•"
			ranges[idx + 2] = '#1a0f0f'; // bullet text
			idx += 2 + entry.bullets[i].length;
			if (i < entry.bullets.length - 1) idx += 1; // '\n'
		}
		return ranges;
	});
</script>

<!-- Door hinge group — bottom-edge pivot, rotates around X axis (drops forward) -->
<T.Group position={[doorCenterX, hingeY, DEPTH + 0.02]} rotation.x={rotX.current}>
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
		<T.Mesh>
			<T.CylinderGeometry args={[0.055, 0.055, 0.012, 32]} />
			<T.MeshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.15} />
		</T.Mesh>
		<T.Mesh>
			<T.TorusGeometry args={[0.055, 0.009, 6, 32]} />
			<T.MeshStandardMaterial color="#b0b0b0" metalness={0.85} roughness={0.45} />
		</T.Mesh>
	</T.Group>

	<!-- Door face label — period if available, otherwise entry title (e.g. Technical Skills) -->
	{#if entry.period}
		<Text
			text={entry.period}
			font="/fonts/Inter_18pt-Medium.ttf"
			position={[0, doorH * 0.28, 0.025]}
			fontSize={0.13}
			color="rgba(255,255,255,0.88)"
			anchorX="center"
			anchorY="middle"
			maxWidth={doorW - 0.2}
			textAlign="center"
		/>
	{:else if entry.title}
		<Text
			text={entry.title}
			font="/fonts/PlusJakartaSans-Bold.ttf"
			position={[0, doorH * 0.28, 0.025]}
			fontSize={0.12}
			color="rgba(255,255,255,0.88)"
			anchorX="center"
			anchorY="middle"
			maxWidth={doorW - 0.2}
			textAlign="center"
		/>
	{/if}
</T.Group>

<!-- Content text — world-space, depth-tested by door geometry.
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

{#if entry.period}
	<Text
		text={entry.period}
		font="/fonts/Inter_18pt-Medium.ttf"
		position={[contentLeft, periodY, contentZ]}
		fontSize={FONT_SUB}
		color="#8a7060"
		anchorX="left"
		anchorY="top"
		maxWidth={contentW}
		fillOpacity={textOpacity.current}
	/>
{/if}

{#if subtitleText}
	<Text
		text={subtitleText}
		font="/fonts/Inter_18pt-Medium.ttf"
		position={[contentLeft, subtitleY, contentZ]}
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
