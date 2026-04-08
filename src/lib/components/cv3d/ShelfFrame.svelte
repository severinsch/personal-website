<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import {
		columns,
		COL_W,
		DEPTH,
		PANEL_T,
		BALL_R,
		TUBE_R
	} from '$lib/content/cv3d-grid';

	const chromeMat = new THREE.MeshStandardMaterial({
		color: 0xd0d0d0,
		metalness: 0.9,
		roughness: 0.15
	});
	// Horizontal shelf plates (top/bottom of compartments) — lightest, receives most light
	const panelMat = new THREE.MeshStandardMaterial({
		color: 0xf0ebe5,
		metalness: 0.05,
		roughness: 0.8
	});
	// Side wall panels — mid tone
	const sideMat = new THREE.MeshStandardMaterial({
		color: 0xd6d0c9,
		metalness: 0.05,
		roughness: 0.82
	});
	// Back panels — most recessed, darkest
	const backMat = new THREE.MeshStandardMaterial({
		color: 0xc5bfb8,
		metalness: 0.02,
		roughness: 0.9
	});

	const dummy = new THREE.Object3D();

	// ── Balls at grid intersections (deduplicated) ──
	const ballMap = new Map<string, [number, number, number]>();
	for (const col of columns) {
		for (const y of col.lineYs) {
			for (const x of [col.leftX, col.rightX]) {
				const key = `${x.toFixed(4)},${y.toFixed(4)}`;
				if (!ballMap.has(key)) ballMap.set(key, [x, y, DEPTH]);
			}
		}
	}
	const ballPositions = [...ballMap.values()];
	const ballGeom = new THREE.SphereGeometry(BALL_R, 16, 16);
	const ballMesh = new THREE.InstancedMesh(ballGeom, chromeMat, ballPositions.length);
	ballPositions.forEach(([x, y, z], i) => {
		dummy.position.set(x, y, z);
		dummy.scale.set(1, 1, 1);
		dummy.updateMatrix();
		ballMesh.setMatrixAt(i, dummy.matrix);
	});
	ballMesh.instanceMatrix.needsUpdate = true;

	// ── Horizontal front-face tubes (one per lineY per column) ──
	const hTubeGeom = new THREE.CylinderGeometry(TUBE_R, TUBE_R, 1, 8);
	hTubeGeom.rotateZ(Math.PI / 2);

	interface TubeInst {
		pos: [number, number, number];
		len: number;
	}
	const hTubes: TubeInst[] = [];
	for (const col of columns) {
		const midX = (col.leftX + col.rightX) / 2;
		const tubeLen = COL_W - 2 * BALL_R;
		for (const y of col.lineYs) {
			hTubes.push({ pos: [midX, y, DEPTH], len: tubeLen });
		}
	}
	const hTubeMesh = new THREE.InstancedMesh(hTubeGeom, chromeMat, hTubes.length);
	hTubes.forEach(({ pos, len }, i) => {
		dummy.position.set(...pos);
		dummy.scale.set(len, 1, 1);
		dummy.updateMatrix();
		hTubeMesh.setMatrixAt(i, dummy.matrix);
	});
	hTubeMesh.instanceMatrix.needsUpdate = true;

	// ── Vertical front-face tube segments (between consecutive lineYs) ──
	const vTubeGeom = new THREE.CylinderGeometry(TUBE_R, TUBE_R, 1, 8);
	const vTubes: TubeInst[] = [];
	for (const col of columns) {
		for (let i = 0; i < col.lineYs.length - 1; i++) {
			const top = col.lineYs[i];
			const bot = col.lineYs[i + 1];
			const midY = (top + bot) / 2;
			const segH = Math.abs(top - bot) - 2 * BALL_R;
			vTubes.push({ pos: [col.leftX, midY, DEPTH], len: segH });
			vTubes.push({ pos: [col.rightX, midY, DEPTH], len: segH });
		}
	}
	const vTubeMesh = new THREE.InstancedMesh(vTubeGeom, chromeMat, vTubes.length);
	vTubes.forEach(({ pos, len }, i) => {
		dummy.position.set(...pos);
		dummy.scale.set(1, len, 1);
		dummy.updateMatrix();
		vTubeMesh.setMatrixAt(i, dummy.matrix);
	});
	vTubeMesh.instanceMatrix.needsUpdate = true;

	// ── Horizontal shelf plates ──
	// lineYs[0] of each column is the coloured top plate — rendered separately in the template.
	// The instanced mesh covers lineYs[1..] only (interior + bottom plates).
	const plateGeom = new THREE.BoxGeometry(COL_W - 2 * PANEL_T, PANEL_T, DEPTH);
	const interiorPlateCount = hTubes.length - columns.length;
	const plateMesh = new THREE.InstancedMesh(plateGeom, panelMat, interiorPlateCount);
	let plateIdx = 0;
	for (const col of columns) {
		const midX = (col.leftX + col.rightX) / 2;
		for (const y of col.lineYs.slice(1)) {
			dummy.position.set(midX, y, DEPTH / 2);
			dummy.scale.set(1, 1, 1);
			dummy.updateMatrix();
			plateMesh.setMatrixAt(plateIdx++, dummy.matrix);
		}
	}
	plateMesh.instanceMatrix.needsUpdate = true;

	// ── Top plate per column — two-tone: coloured +y face, cream −y face ──
	// BoxGeometry face material index order: +x, -x, +y (top), -y (bottom), +z, -z
	const topPlateGeom = new THREE.BoxGeometry(COL_W - 2 * PANEL_T, PANEL_T, DEPTH);
	const topPlateMeshes = columns.map((col) => {
		const topMat = new THREE.MeshStandardMaterial({
			color: new THREE.Color(col.topColor),
			roughness: 0.35,
			metalness: 0.1
		});
		// +y (top) = section colour, everything else = cream panel
		const mats = [panelMat, panelMat, topMat, panelMat, panelMat, panelMat];
		const mesh = new THREE.Mesh(topPlateGeom, mats);
		mesh.position.set((col.leftX + col.rightX) / 2, col.lineYs[0], DEPTH / 2);
		return mesh;
	});

	// ── Side walls — one panel per unique x boundary, full column height ──
	const sideWallMap = new Map<number, { top: number; bottom: number }>();
	for (const col of columns) {
		for (const x of [col.leftX, col.rightX]) {
			const top = col.lineYs[0];
			const bottom = col.lineYs[col.lineYs.length - 1];
			const existing = sideWallMap.get(x);
			if (!existing) {
				sideWallMap.set(x, { top, bottom });
			} else {
				sideWallMap.set(x, {
					top: Math.max(existing.top, top),
					bottom: Math.min(existing.bottom, bottom)
				});
			}
		}
	}
	const sideWalls = [...sideWallMap.entries()].map(([x, { top, bottom }]) => ({
		x,
		h: top - bottom,
		midY: (top + bottom) / 2
	}));

	// ── Depth tubes at column corners (deduplicated) ──
	// Use actual lineYs[0] / lineYs[last] so bottom-aligned columns are correct.
	const depthTubeLen = DEPTH - 2 * BALL_R;
	const depthTubeMap = new Map<string, { x: number; y: number }>();
	for (const col of columns) {
		const colTop = col.lineYs[0];
		const colBottom = col.lineYs[col.lineYs.length - 1];
		for (const x of [col.leftX, col.rightX]) {
			for (const y of [colTop, colBottom]) {
				const key = `${x.toFixed(4)},${y.toFixed(4)}`;
				if (!depthTubeMap.has(key)) depthTubeMap.set(key, { x, y });
			}
		}
	}
	const depthTubes = [...depthTubeMap.values()];
</script>

<!-- Instanced geometry -->
<T is={ballMesh} />
<T is={hTubeMesh} />
<T is={vTubeMesh} />
<T is={plateMesh} />

<!-- Per-column back panels -->
{#each columns as col}
	{@const midX = (col.leftX + col.rightX) / 2}
	{@const colTop = col.lineYs[0]}
	{@const colBottom = col.lineYs[col.lineYs.length - 1]}
	{@const colH = colTop - colBottom}
	{@const colMidY = (colTop + colBottom) / 2}
	<!-- Back panel — darkest, most recessed -->
	<T.Mesh position={[midX, colMidY, PANEL_T / 2]}>
		<T.BoxGeometry args={[COL_W, colH, PANEL_T]} />
		<T is={backMat} />
	</T.Mesh>
{/each}

<!-- Side walls — one panel per unique x boundary -->
{#each sideWalls as sw}
	<T.Mesh position={[sw.x, sw.midY, DEPTH / 2]}>
		<T.BoxGeometry args={[PANEL_T, sw.h, DEPTH]} />
		<T is={sideMat} />
	</T.Mesh>
{/each}

<!-- Depth tubes at column corners -->
{#each depthTubes as dt}
	<T.Mesh position={[dt.x, dt.y, DEPTH / 2]} rotation.x={Math.PI / 2}>
		<T.CylinderGeometry args={[TUBE_R, TUBE_R, depthTubeLen, 8]} />
		<T.MeshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.15} />
	</T.Mesh>
{/each}

<!-- Two-tone top plates: coloured from above, cream underneath (matches header interior) -->
{#each topPlateMeshes as mesh}
	<T is={mesh} />
{/each}

<!-- Balls at back-face corners (one per column corner, for depth) -->
{#each columns as col}
	{#each [col.leftX, col.rightX] as x}
		{#each [col.lineYs[0], col.lineYs[col.lineYs.length - 1]] as y}
			<T.Mesh position={[x, y, 0]}>
				<T.SphereGeometry args={[BALL_R, 16, 16]} />
				<T.MeshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.15} />
			</T.Mesh>
		{/each}
	{/each}
{/each}
