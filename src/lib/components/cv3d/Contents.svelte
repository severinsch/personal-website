<script lang="ts">
	// Props inside a compartment, revealed when its flap drops
	import { T, useThrelte } from '@threlte/core';
	import * as THREE from 'three';
	import { DEPTH, PANEL_T, sections, type Slot } from '$lib/content/cv3d-grid';

	let { slot }: { slot: Slot } = $props();

	const item = $derived(slot.item);
	const floor = $derived(slot.y - slot.h / 2 + PANEL_T / 2);
	const left = $derived(slot.x - slot.w / 2 + 0.02);
	const accent = $derived(sections[item.section].ui);

	// deterministic pseudo-random per compartment
	function rng(seed: number) {
		return () => {
			seed = (seed * 16807) % 2147483647;
			return (seed - 1) / 2147483646;
		};
	}
	const seed = $derived(([...item.id].reduce((a, c) => a * 31 + c.charCodeAt(0), 7) % 100000) + 1);

	// DPSG lily (from dpsg.de/de/vorlagen), loaded only for the scouting compartments
	const { invalidate } = useThrelte();
	const lilyMat = new THREE.MeshStandardMaterial({
		transparent: true,
		alphaTest: 0.4,
		roughness: 0.8
	});
	$effect(() => {
		if (item.section !== 'volunteer') return;
		new THREE.TextureLoader().load('/cv3d/dpsg-lilie.png', (tex) => {
			tex.colorSpace = THREE.SRGBColorSpace;
			tex.anisotropy = 4;
			lilyMat.map = tex;
			lilyMat.needsUpdate = true;
			invalidate();
		});
	});

	const BRAND: Record<string, string> = { TUM: '#3070b3', Amazon: '#f29a1d' };
	const paper = '#f3efe6';
	const dark = '#2a2a2d';

	// ── Experience: Leitz-style ring binders ──
	const binders = $derived.by(() => {
		if (item.section !== 'experience') return [];
		const r = rng(seed);
		const n = Math.min(5, Math.max(2, item.bullets.length + 1));
		const palette = [dark, '#d9d5cc', '#9e968a', '#6e757c', '#d9d5cc'];
		// a nod to the employer: TUM blue, Amazon orange
		const brand = BRAND[item.doorLabel];
		const branded = new Set(brand ? [0, n > 3 ? 2 : -1] : []);
		let x = left + 0.015;
		return Array.from({ length: n }, (_, i) => {
			const w = i % 3 === 1 ? 0.05 : 0.075;
			const color = branded.has(i) ? brand : palette[Math.floor(r() * palette.length)];
			const b = { x: x + w / 2, w, color, lean: 0 };
			x += w + 0.003;
			if (i === n - 1) {
				b.lean = 0.14; // the last one leans against the others
				b.x += 0.03;
			}
			return b;
		});
	});

	// ── Education: a stack of books and a diploma roll ──
	const books = $derived.by(() => {
		if (item.section !== 'education') return [];
		const r = rng(seed);
		const colors = ['#1f2f4a', '#7b2a24', '#e4dccb', '#2f5a45', '#c9a24a'];
		let y = floor;
		return Array.from({ length: 3 + Math.floor(r() * 2) }, () => {
			const t = 0.028 + r() * 0.02;
			const b = {
				y: y + t / 2,
				t,
				w: 0.22 + r() * 0.07,
				d: 0.17 + r() * 0.05,
				rot: (r() - 0.5) * 0.25,
				color: colors[Math.floor(r() * colors.length)]
			};
			y += t;
			return b;
		});
	});

	// ── Awards: trophy ──
	const trophyGeom = new THREE.LatheGeometry(
		[
			[0.045, 0],
			[0.045, 0.018],
			[0.03, 0.022],
			[0.012, 0.035],
			[0.009, 0.085],
			[0.016, 0.095],
			[0.04, 0.115],
			[0.054, 0.16],
			[0.058, 0.205],
			[0.054, 0.205],
			[0.05, 0.165]
		].map(([x, y]) => new THREE.Vector2(x, y)),
		48
	);
	const gold = new THREE.MeshStandardMaterial({ color: '#d9ab4f', metalness: 1, roughness: 0.22 });

	// ── Skills: card index box ──
	const cards = $derived(item.tags ?? []);
</script>

<T.Group>
	{#each binders as b}
		<T.Group position={[b.x, floor, -DEPTH / 2 - 0.02]} rotation.z={b.lean}>
			<T.Mesh position.y={0.142} castShadow receiveShadow>
				<T.BoxGeometry args={[b.w, 0.284, 0.28]} />
				<T.MeshStandardMaterial color={b.color} roughness={0.75} />
			</T.Mesh>
			<!-- spine label & finger hole -->
			<T.Mesh position={[0, 0.2, 0.1405]}>
				<T.PlaneGeometry args={[b.w * 0.72, 0.09]} />
				<T.MeshStandardMaterial color={paper} roughness={0.9} />
			</T.Mesh>
			<T.Mesh position={[0, 0.055, 0.1405]}>
				<T.CircleGeometry args={[Math.min(0.012, b.w * 0.2), 24]} />
				<T.MeshBasicMaterial color="#1c1c1c" />
			</T.Mesh>
		</T.Group>
	{/each}

	{#each books as b}
		<T.Group position={[slot.x - slot.w * 0.12, b.y, -DEPTH / 2 - 0.03]} rotation.y={b.rot}>
			<T.Mesh castShadow receiveShadow>
				<T.BoxGeometry args={[b.w, b.t, b.d]} />
				<T.MeshStandardMaterial color={b.color} roughness={0.7} />
			</T.Mesh>
			<T.Mesh position={[0.004, 0, 0.004]}>
				<T.BoxGeometry args={[b.w - 0.004, b.t - 0.006, b.d - 0.002]} />
				<T.MeshStandardMaterial color={paper} roughness={0.95} />
			</T.Mesh>
		</T.Group>
	{/each}
	{#if item.section === 'education'}
		<T.Group position={[slot.x + slot.w * 0.24, floor + 0.019, -0.11]} rotation.y={0.5}>
			<T.Mesh rotation.z={Math.PI / 2} castShadow>
				<T.CylinderGeometry args={[0.019, 0.019, 0.21, 32]} />
				<T.MeshStandardMaterial color={paper} roughness={0.85} />
			</T.Mesh>
			<T.Mesh rotation.y={Math.PI / 2}>
				<T.TorusGeometry args={[0.0195, 0.003, 8, 32]} />
				<T.MeshStandardMaterial color="#9e1e35" roughness={0.5} />
			</T.Mesh>
		</T.Group>
	{/if}

	{#if item.section === 'volunteer' && item.index === 1}
		<!-- a black Kohte (closed) with its crossed poles, and the group banner with the DPSG lily -->
		<T.Group position={[slot.x - 0.07, floor, -DEPTH / 2 - 0.01]} rotation.y={0.3}>
			<T.Mesh position.y={0.095} castShadow receiveShadow>
				<T.ConeGeometry args={[0.125, 0.19, 8, 1, true]} />
				<T.MeshStandardMaterial color="#1e1e1f" roughness={0.95} flatShading side={2} />
			</T.Mesh>
			{#each [-1, 1] as s}
				<T.Mesh position.y={0.19} rotation.z={s * 0.32} castShadow>
					<T.CylinderGeometry args={[0.0035, 0.0035, 0.09, 6]} />
					<T.MeshStandardMaterial color="#9b7650" roughness={0.8} />
				</T.Mesh>
			{/each}
		</T.Group>
		<T.Group position={[slot.x + 0.15, floor, -DEPTH / 2 - 0.03]} rotation.y={-0.25}>
			<T.Mesh position.y={0.14} castShadow>
				<T.CylinderGeometry args={[0.004, 0.004, 0.28, 8]} />
				<T.MeshStandardMaterial color="#9b7650" roughness={0.8} />
			</T.Mesh>
			<T.Mesh position.y={0.265} rotation.z={Math.PI / 2} castShadow>
				<T.CylinderGeometry args={[0.003, 0.003, 0.15, 8]} />
				<T.MeshStandardMaterial color="#9b7650" roughness={0.8} />
			</T.Mesh>
			<T.Mesh position={[0, 0.18, 0.006]} castShadow>
				<T.PlaneGeometry args={[0.13, 0.165]} />
				<T.MeshStandardMaterial color="#efe9da" roughness={0.95} side={2} />
			</T.Mesh>
			<T.Mesh position={[0, 0.185, 0.0072]} material={lilyMat}>
				<T.PlaneGeometry args={[0.09, 0.09]} />
			</T.Mesh>
		</T.Group>
	{/if}

	{#if item.section === 'volunteer' && item.index !== 1}
		<!-- campfire with a Hordentopf, and an embroidered lily patch against the back -->
		<T.Group position={[slot.x - 0.05, floor, -DEPTH / 2 + 0.02]}>
			{#each Array.from({ length: 9 }, (_, i) => (i / 9) * Math.PI * 2) as a}
				<T.Mesh
					position={[Math.cos(a) * 0.075, 0.012, Math.sin(a) * 0.075]}
					rotation={[a, a * 2, 0]}
					castShadow
					receiveShadow
				>
					<T.DodecahedronGeometry args={[0.016]} />
					<T.MeshStandardMaterial color="#8d8a84" roughness={0.9} flatShading />
				</T.Mesh>
			{/each}
			{#each [0, 1, 2, 3] as i}
				<T.Group rotation.y={(i * Math.PI) / 2 + 0.3}>
					<T.Mesh position={[0.025, 0.035, 0]} rotation.z={0.6} castShadow>
						<T.CylinderGeometry args={[0.007, 0.008, 0.085, 7]} />
						<T.MeshStandardMaterial color="#6b4a2e" roughness={0.9} />
					</T.Mesh>
				</T.Group>
			{/each}
			<T.Mesh position.y={0.04}>
				<T.ConeGeometry args={[0.028, 0.08, 10]} />
				<T.MeshBasicMaterial color="#ff7a1f" toneMapped={false} transparent opacity={0.9} />
			</T.Mesh>
			<T.Mesh position.y={0.03}>
				<T.ConeGeometry args={[0.016, 0.05, 10]} />
				<T.MeshBasicMaterial color="#ffd36b" toneMapped={false} />
			</T.Mesh>
		</T.Group>
		<T.Group position={[slot.x + 0.13, floor, -0.13]}>
			<T.Mesh position.y={0.028} castShadow receiveShadow>
				<T.CylinderGeometry args={[0.04, 0.036, 0.056, 28]} />
				<T.MeshStandardMaterial color="#1c1c1c" roughness={0.55} metalness={0.5} />
			</T.Mesh>
			<T.Mesh position.y={0.056} rotation.y={0.4}>
				<T.TorusGeometry args={[0.039, 0.0018, 6, 24, Math.PI]} />
				<T.MeshStandardMaterial color="#555" metalness={0.8} roughness={0.4} />
			</T.Mesh>
		</T.Group>
		<T.Group
			position={[slot.x - 0.15, floor + 0.075, -DEPTH + 0.02]}
			rotation.x={Math.PI / 2 - 0.12}
		>
			<T.Mesh castShadow>
				<T.CylinderGeometry args={[0.05, 0.05, 0.004, 40]} />
				<T.MeshStandardMaterial color="#c9b98f" roughness={0.95} />
			</T.Mesh>
			<T.Mesh position.y={0.0022} rotation.x={-Math.PI / 2} material={lilyMat}>
				<T.PlaneGeometry args={[0.068, 0.068]} />
			</T.Mesh>
		</T.Group>
	{/if}

	{#if item.section === 'awards'}
		<T.Group position={[slot.x - 0.05, floor, -DEPTH / 2]}>
			<T.Mesh geometry={trophyGeom} material={gold} castShadow />
			{#each [-1, 1] as side}
				<T.Mesh
					position={[side * 0.052, 0.168, 0]}
					rotation.z={-side * (Math.PI / 2)}
					material={gold}
				>
					<T.TorusGeometry args={[0.024, 0.004, 8, 24, Math.PI]} />
				</T.Mesh>
			{/each}
			<T.Mesh position={[0, 0.009, 0]}>
				<T.BoxGeometry args={[0.1, 0.018, 0.1]} />
				<T.MeshStandardMaterial color="#1d1d1f" roughness={0.4} />
			</T.Mesh>
		</T.Group>
		<!-- medal leaning against the back -->
		<T.Group position={[slot.x + 0.13, floor + 0.11, -DEPTH + 0.03]} rotation.x={-0.15}>
			<T.Mesh position.y={0.06}>
				<T.BoxGeometry args={[0.03, 0.12, 0.002]} />
				<T.MeshStandardMaterial color="#1f4a8a" roughness={0.7} />
			</T.Mesh>
			<T.Mesh rotation.x={Math.PI / 2} material={gold} castShadow>
				<T.CylinderGeometry args={[0.035, 0.035, 0.006, 40]} />
			</T.Mesh>
		</T.Group>
	{/if}

	{#if item.section === 'skills'}
		<!-- card index box with one card per skill -->
		{@const bw = 0.17}
		{@const bh = 0.09}
		{@const bd = 0.25}
		<T.Group position={[slot.x - 0.04, floor, -DEPTH / 2 - 0.01]} rotation.y={0.08}>
			{#each [[0, PANEL_T, 0, bw, 0.006, bd], [-bw / 2, bh / 2, 0, 0.006, bh, bd], [bw / 2, bh / 2, 0, 0.006, bh, bd], [0, bh / 2, -bd / 2, bw, bh, 0.006], [0, bh * 0.35, bd / 2, bw, bh * 0.7, 0.006]] as [x, y, z, w, h, d]}
				<T.Mesh position={[x, y, z]} castShadow receiveShadow>
					<T.BoxGeometry args={[w, h, d]} />
					<T.MeshStandardMaterial color="#c49a6c" roughness={0.6} />
				</T.Mesh>
			{/each}
			{#each cards as _, i}
				{@const z = bd / 2 - 0.03 - i * ((bd - 0.05) / Math.max(1, cards.length - 1))}
				<T.Group position={[0, 0.006, z]} rotation.x={-0.12}>
					<T.Mesh position.y={0.055}>
						<T.BoxGeometry args={[bw - 0.016, 0.11, 0.0012]} />
						<T.MeshStandardMaterial color={paper} roughness={0.95} />
					</T.Mesh>
					<T.Mesh position={[((i % 4) - 1.5) * 0.035, 0.115, 0]}>
						<T.BoxGeometry args={[0.028, 0.012, 0.0014]} />
						<T.MeshStandardMaterial color={i % 2 ? accent : '#3e4a82'} roughness={0.8} />
					</T.Mesh>
				</T.Group>
			{/each}
		</T.Group>
	{/if}
</T.Group>
