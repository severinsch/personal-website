<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import { BALL_R, DEPTH, FOOT_H, PANEL_T, TUBE_R, type ShelfLayout } from '$lib/content/cv3d-grid';
	import { chromeMat, paintMat, BODY_COLOR } from './materials';

	let { layout }: { layout: ShelfLayout } = $props();

	const bodyMat = paintMat(BODY_COLOR);

	const dummy = new THREE.Object3D();
	const ZS = [0, -DEPTH]; // front / back planes of the frame

	function instanced(
		geom: THREE.BufferGeometry,
		mat: THREE.Material,
		list: { p: [number, number, number]; s?: [number, number, number] }[]
	) {
		const mesh = new THREE.InstancedMesh(geom, mat, list.length);
		list.forEach(({ p, s }, i) => {
			dummy.position.set(...p);
			dummy.scale.set(...(s ?? [1, 1, 1]));
			dummy.updateMatrix();
			mesh.setMatrixAt(i, dummy.matrix);
		});
		mesh.instanceMatrix.needsUpdate = true;
		mesh.castShadow = true;
		mesh.receiveShadow = true;
		return mesh;
	}

	const meshes = $derived.by(() => {
		const { xs, ys } = layout;
		const nCols = xs.length - 1;
		const nRows = ys.length - 1;
		const top = ys[0];
		const bottom = ys[nRows];

		// Balls at every node, front and back
		const balls = [];
		for (const x of xs)
			for (const y of ys)
				for (const z of ZS) balls.push({ p: [x, y, z] as [number, number, number] });

		// Tubes along x (every row line), y (every column line) and z (every node)
		const tubeX = [];
		for (let c = 0; c < nCols; c++) {
			const w = xs[c + 1] - xs[c];
			for (const y of ys)
				for (const z of ZS)
					tubeX.push({
						p: [(xs[c] + xs[c + 1]) / 2, y, z] as [number, number, number],
						s: [w, 1, 1] as [number, number, number]
					});
		}
		const tubeY = [];
		for (const x of xs)
			for (let r = 0; r < nRows; r++)
				for (const z of ZS)
					tubeY.push({
						p: [x, (ys[r] + ys[r + 1]) / 2, z] as [number, number, number],
						s: [1, ys[r] - ys[r + 1], 1] as [number, number, number]
					});
		const tubeZ = [];
		for (const x of xs)
			for (const y of ys)
				tubeZ.push({
					p: [x, y, -DEPTH / 2] as [number, number, number],
					s: [1, 1, DEPTH] as [number, number, number]
				});

		// Levelling glides under the bottom nodes
		const feet = [];
		for (const x of xs) for (const z of ZS) feet.push({ p: [x, 0, z] as [number, number, number] });

		// Steel panels: top/bottom/shelves, back, sides & dividers (inset between tubes)
		const g = TUBE_R * 0.6;
		const hPanels = [];
		for (let c = 0; c < nCols; c++) {
			const w = xs[c + 1] - xs[c] - 2 * g;
			for (const y of ys)
				hPanels.push({
					p: [(xs[c] + xs[c + 1]) / 2, y, -DEPTH / 2] as [number, number, number],
					s: [w, PANEL_T, DEPTH - 2 * g] as [number, number, number]
				});
		}
		const backPanels = [];
		for (let c = 0; c < nCols; c++)
			for (let r = 0; r < nRows; r++)
				backPanels.push({
					p: [(xs[c] + xs[c + 1]) / 2, (ys[r] + ys[r + 1]) / 2, -DEPTH] as [number, number, number],
					s: [xs[c + 1] - xs[c] - 2 * g, ys[r] - ys[r + 1] - 2 * g, PANEL_T] as [
						number,
						number,
						number
					]
				});
		const sidePanels = [];
		for (const x of xs)
			for (let r = 0; r < nRows; r++)
				sidePanels.push({
					p: [x, (ys[r] + ys[r + 1]) / 2, -DEPTH / 2] as [number, number, number],
					s: [PANEL_T, ys[r] - ys[r + 1] - 2 * g, DEPTH - 2 * g] as [number, number, number]
				});

		const box = new THREE.BoxGeometry(1, 1, 1);
		const sphere = new THREE.SphereGeometry(BALL_R, 32, 24);
		const tx = new THREE.CylinderGeometry(TUBE_R, TUBE_R, 1, 20).rotateZ(Math.PI / 2);
		const ty = new THREE.CylinderGeometry(TUBE_R, TUBE_R, 1, 20);
		const tz = new THREE.CylinderGeometry(TUBE_R, TUBE_R, 1, 20).rotateX(Math.PI / 2);
		// Foot: a thin threaded stem and a round glide on the floor
		const stemH = FOOT_H - BALL_R;
		const stem = new THREE.CylinderGeometry(0.006, 0.006, stemH, 16).translate(0, stemH / 2, 0);
		const glide = new THREE.CylinderGeometry(0.014, 0.016, 0.008, 24).translate(0, 0.004, 0);

		return {
			bounds: { top, bottom },
			list: [
				instanced(sphere, chromeMat, balls),
				instanced(tx, chromeMat, tubeX),
				instanced(ty, chromeMat, tubeY),
				instanced(tz, chromeMat, tubeZ),
				instanced(stem, chromeMat, feet),
				instanced(glide, chromeMat, feet),
				instanced(box, bodyMat, hPanels),
				instanced(box, bodyMat, backPanels),
				instanced(box, bodyMat, sidePanels)
			]
		};
	});
</script>

{#each meshes.list as mesh (mesh.uuid)}
	<T is={mesh} />
{/each}
