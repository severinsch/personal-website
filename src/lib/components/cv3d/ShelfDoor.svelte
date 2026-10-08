<script lang="ts">
	import { T } from '@threlte/core';
	import { Text } from '@threlte/extras';
	import { Spring } from 'svelte/motion';
	import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
	import { DOOR_GAP, DOOR_T, sections, type Slot } from '$lib/content/cv3d-grid';
	import { chromeMat, paintMat } from './materials';
	import { cv, input } from './state.svelte';

	let { slot }: { slot: Slot } = $props();

	const item = $derived(slot.item);
	const open = $derived(cv.focused === item.id);
	const hovered = $derived(cv.hovered === item.id);
	const lit = $derived(hovered || cv.section === item.section);

	const dw = $derived(slot.w - 2 * DOOR_GAP);
	const dh = $derived(slot.h - 2 * DOOR_GAP);
	const geom = $derived(new RoundedBoxGeometry(dw, dh, DOOR_T, 3, 0.0025));

	const mat = paintMat('#ffffff');
	$effect(() => {
		mat.color.set(sections[item.section].color);
	});
	$effect(() => {
		mat.emissive.set(lit && !open ? '#ffffff' : '#000000');
		mat.emissiveIntensity = item.section === 'experience' ? 0.03 : 0.07;
	});

	// Drop-down flap: hinged at the bottom edge, opens towards the viewer and stops horizontal
	const rot = new Spring(0, { stiffness: 0.09, damping: 0.42 });
	const pop = new Spring(0, { stiffness: 0.2, damping: 0.7 });
	$effect(() => {
		rot.target = open ? Math.PI / 2 : 0;
	});
	$effect(() => {
		pop.target = lit && !open ? 0.008 : 0;
	});

	const ink = $derived(sections[item.section].ink);
	const pad = 0.028;
	const big = $derived(slot.w > 0.6 ? 0.032 : 0.026);
	const font = '/fonts/PlusJakartaSans-Bold.ttf';
	const fontBody = '/fonts/Inter_18pt-Medium.ttf';
	const num = $derived(
		`${sections[item.section].label.toUpperCase()}  ${String(item.index).padStart(2, '0')}`
	);
</script>

<T.Group
	position={[slot.x, slot.y - slot.h / 2 + DOOR_GAP, 0.003 + pop.current]}
	rotation.x={rot.current}
>
	<T.Mesh
		geometry={geom}
		material={mat}
		position={[0, dh / 2, -DOOR_T / 2]}
		castShadow
		receiveShadow
		onclick={(e: { stopPropagation: () => void }) => {
			e.stopPropagation();
			if (input.wasDrag) return;
			input.doorClicked = true;
			cv.focused = open ? null : item.id;
		}}
		onpointerenter={() => {
			cv.hovered = item.id;
			document.body.style.cursor = 'pointer';
		}}
		onpointerleave={() => {
			if (cv.hovered === item.id) cv.hovered = null;
			document.body.style.cursor = '';
		}}
	/>

	<!-- Cylinder lock, top centre -->
	<T.Group position={[0, dh - 0.03, 0.002]} rotation.x={Math.PI / 2}>
		<T.Mesh material={chromeMat} castShadow>
			<T.CylinderGeometry args={[0.0085, 0.0095, 0.006, 32]} />
		</T.Mesh>
		<T.Mesh position={[0, 0.0031, 0]}>
			<T.BoxGeometry args={[0.0018, 0.0004, 0.008]} />
			<T.MeshBasicMaterial color="#222" />
		</T.Mesh>
	</T.Group>

	<!-- Print -->
	<Text
		text={num}
		font={fontBody}
		fontSize={0.0115}
		letterSpacing={0.12}
		color={ink}
		fillOpacity={0.62}
		anchorX="left"
		anchorY="top"
		position={[-dw / 2 + pad, dh - pad, 0.0006]}
	/>
	<Text
		text={item.doorLabel}
		{font}
		fontSize={big}
		letterSpacing={-0.01}
		color={ink}
		anchorX="left"
		anchorY="bottom"
		maxWidth={dw - 2 * pad}
		position={[-dw / 2 + pad, pad + 0.022, 0.0006]}
	/>
	<Text
		text={item.doorSub}
		font={fontBody}
		fontSize={0.0135}
		color={ink}
		fillOpacity={0.78}
		anchorX="left"
		anchorY="bottom"
		maxWidth={dw - 2 * pad}
		position={[-dw / 2 + pad, pad, 0.0006]}
	/>
</T.Group>
