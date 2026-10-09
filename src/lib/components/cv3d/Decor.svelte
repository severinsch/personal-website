<script lang="ts">
	// Styling on top of the sideboard: books, a snake plant and an Akari lamp
	// (the lamp toggles dark mode, like the one in the site's corner)
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { Spring } from 'svelte/motion';
	import { DEPTH, PANEL_T, type ShelfLayout } from '$lib/content/cv3d-grid';
	import { theme } from '$lib/theme.svelte';
	import { input, lowPower } from './state.svelte';

	let { layout }: { layout: ShelfLayout } = $props();

	const top = $derived(layout.ys[0] + PANEL_T / 2);
	const wide = $derived(layout.orientation === 'landscape');
	const W = $derived(layout.width);

	// ── Square Akari: a pillowed paper cube between horizontal ribs, on a low wire base ──
	const BASE_H = 0.045; // shade bottom above the shelf
	const SW = 0.2; // shade width / depth
	const SH = 0.26; // shade height
	const N_RIBS = 8;
	const ribYs = Array.from({ length: N_RIBS + 1 }, (_, i) => (i / N_RIBS) * SH);

	const shadeGeom = (() => {
		const g = new THREE.BoxGeometry(SW, SH, SW, 16, N_RIBS * 6, 16);
		const p = g.attributes.position;
		const h = SW / 2;
		for (let i = 0; i < p.count; i++) {
			const x = p.getX(i);
			const y = p.getY(i) + SH / 2;
			const z = p.getZ(i);
			// paper bellies out between ribs, and most in the middle of each face
			const pleat = Math.sin(Math.PI * ((y / SH) * N_RIBS - Math.floor((y / SH) * N_RIBS)));
			const edgeY = Math.min(1, (Math.min(y, SH - y) / SH) * 10); // flat at top/bottom rim
			const fx = 1 - (z / h) ** 2;
			const fz = 1 - (x / h) ** 2;
			const b = 0.012 * pleat * edgeY;
			if (Math.abs(x) > h - 1e-6) p.setX(i, x + Math.sign(x) * b * fx);
			if (Math.abs(z) > h - 1e-6) p.setZ(i, z + Math.sign(z) * b * fz);
			// shift so the shade stands on y = 0
			p.setY(i, y);
		}
		g.computeVertexNormals();
		// open at the top and bottom, like the real thing (box faces: ±x, ±y, ±z)
		const keep = g.groups.filter((gr) => gr.materialIndex !== 2 && gr.materialIndex !== 3);
		g.clearGroups();
		for (const gr of keep) g.addGroup(gr.start, gr.count, 0);
		return g;
	})();
	// thin wire ribs: four bars per level, sitting in the pleat valleys
	const ribBars = ribYs.flatMap((y) => [0, 1, 2, 3].map((side) => ({ y, side })));
	const glow = new Spring(theme.isDark ? 1 : 0, { stiffness: 0.06, damping: 0.9 });
	$effect(() => {
		glow.target = theme.isDark ? 1 : 0;
	});
	const shadeMat = new THREE.MeshStandardMaterial({
		color: '#f4ecdc',
		roughness: 0.95,
		side: THREE.DoubleSide,
		emissive: new THREE.Color('#ffb860')
	});
	$effect(() => {
		shadeMat.emissiveIntensity = glow.current * 1.6;
	});
	const wire = new THREE.MeshStandardMaterial({ color: '#1b1b1b', roughness: 0.5, metalness: 0.4 });
	// inner ribs show through the paper: faint by day, darker against the glow at night
	const ribMat = new THREE.MeshStandardMaterial({ color: '#b9ab94', roughness: 0.9 });
	$effect(() => {
		ribMat.color.set(theme.isDark ? '#7a5a36' : '#c4b79f');
	});

	const lampX = $derived(wide ? W / 2 - 0.4 : W / 2 - 0.22);
	// base: four short legs joined by a square frame under the shade
	const legXZ = [
		[-1, -1],
		[1, -1],
		[1, 1],
		[-1, 1]
	].map(([a, b]) => [a * (SW / 2 - 0.012), b * (SW / 2 - 0.012)]);

	// ── Books ──
	const books = [
		{ w: 0.32, t: 0.035, d: 0.24, c: '#e9e4d8', r: 0.04 },
		{ w: 0.29, t: 0.028, d: 0.22, c: '#20324f', r: -0.05 },
		{ w: 0.25, t: 0.04, d: 0.19, c: '#b54a2a', r: 0.12 }
	];
	const stacked = books.map((b, i) => ({
		...b,
		y: books.slice(0, i).reduce((a, o) => a + o.t, 0) + b.t / 2
	}));
	const acc = books.reduce((a, b) => a + b.t, 0);

	// ── Snake plant ──
	const leaves = Array.from({ length: 9 }, (_, i) => {
		const a = i * 2.4;
		return {
			h: 0.2 + (((i * 37) % 11) / 11) * 0.16,
			x: Math.cos(a) * 0.022,
			z: Math.sin(a) * 0.022,
			ry: a,
			tilt: 0.06 + ((i * 13) % 5) * 0.03
		};
	});
	const leafMat = new THREE.MeshStandardMaterial({ color: '#3f6b3a', roughness: 0.55 });
</script>

<!-- Books -->
<T.Group position={[-W / 2 + (wide ? 0.42 : 0.25), top, -DEPTH / 2 + 0.01]}>
	{#each stacked as b}
		<T.Group position.y={b.y} rotation.y={b.r}>
			<T.Mesh castShadow receiveShadow>
				<T.BoxGeometry args={[b.w, b.t, b.d]} />
				<T.MeshStandardMaterial color={b.c} roughness={0.7} />
			</T.Mesh>
			<T.Mesh position={[0.003, 0, 0.003]}>
				<T.BoxGeometry args={[b.w - 0.003, b.t - 0.005, b.d - 0.002]} />
				<T.MeshStandardMaterial color="#f5f1e8" roughness={0.95} />
			</T.Mesh>
		</T.Group>
	{/each}
	<!-- a little ceramic cup on the books -->
	<T.Mesh position={[0.05, acc + 0.03, 0.02]} castShadow>
		<T.CylinderGeometry args={[0.03, 0.026, 0.06, 32]} />
		<T.MeshStandardMaterial color="#e2ddd2" roughness={0.3} />
	</T.Mesh>
</T.Group>

<!-- Snake plant in a white pot -->
{#if wide}
	<T.Group position={[-W / 2 + 1.0, top, -DEPTH / 2]}>
		<T.Mesh position.y={0.07} castShadow receiveShadow>
			<T.CylinderGeometry args={[0.075, 0.06, 0.14, 40]} />
			<T.MeshStandardMaterial color="#efece6" roughness={0.35} />
		</T.Mesh>
		<T.Mesh position.y={0.135}>
			<T.CylinderGeometry args={[0.068, 0.068, 0.005, 32]} />
			<T.MeshStandardMaterial color="#3b2a20" roughness={1} />
		</T.Mesh>
		{#each leaves as l}
			<T.Group position={[l.x, 0.13, l.z]} rotation={[l.tilt, l.ry, 0]}>
				<T.Mesh position.y={l.h / 2} scale={[1, 1, 0.22]} material={leafMat} castShadow>
					<T.ConeGeometry args={[0.022, l.h, 12]} />
				</T.Mesh>
			</T.Group>
		{/each}
	</T.Group>
{/if}

<!-- Akari lamp -->
<T.Group position={[lampX, top, -DEPTH / 2]} rotation.y={0.35}>
	{#each legXZ as [x, z]}
		<T.Mesh position={[x, BASE_H / 2, z]} material={wire} castShadow>
			<T.CylinderGeometry args={[0.0018, 0.0018, BASE_H, 6]} />
		</T.Mesh>
	{/each}
	<T.Mesh
		geometry={shadeGeom}
		material={shadeMat}
		position.y={BASE_H}
		onclick={(e: { stopPropagation: () => void }) => {
			e.stopPropagation();
			if (input.wasDrag) return;
			input.doorClicked = true;
			theme.toggle();
		}}
		onpointerenter={() => (document.body.style.cursor = 'pointer')}
		onpointerleave={() => (document.body.style.cursor = '')}
	/>
	{#each ribBars as r}
		{@const rim = r.y === 0 || r.y === SH}
		<T.Group position.y={BASE_H + r.y} rotation.y={(r.side * Math.PI) / 2}>
			<T.Mesh position.z={SW / 2 + 0.0004} material={rim ? wire : ribMat}>
				<T.BoxGeometry args={[SW, rim ? 0.0022 : 0.0012, rim ? 0.0022 : 0.0008]} />
			</T.Mesh>
		</T.Group>
	{/each}
	<!-- warm light from inside the shade, only at night. It casts shadows so the shelf's top
	     panels keep it out of the compartments (the paper shade itself doesn't block it). -->
	<T.PointLight
		position.y={BASE_H + SH / 2}
		intensity={glow.current * 2.6}
		distance={4}
		decay={1.4}
		color="#ffb860"
		castShadow={theme.isDark && !lowPower}
		shadow.mapSize={[1024, 1024]}
		shadow.bias={-0.002}
		shadow.camera.near={0.02}
		shadow.camera.far={4}
	/>
</T.Group>
