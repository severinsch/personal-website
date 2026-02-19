<script lang="ts">
	import { T } from '@threlte/core';
	import * as THREE from 'three';
	import {
		SHELF_W,
		DATE_COL_W,
		CONTENT_COL_W,
		DEPTH,
		PANEL_T,
		BALL_R,
		TUBE_R,
		LEFT_X,
		DIVIDER_X,
		RIGHT_X,
		lineYs,
		totalHeight,
		rows
	} from '$lib/content/cv3d-grid';

	const COL_XS = [LEFT_X, DIVIDER_X, RIGHT_X];
	const chromeMat = new THREE.MeshStandardMaterial({
		color: 0xd0d0d0,
		metalness: 0.9,
		roughness: 0.15
	});
	const panelMat = new THREE.MeshStandardMaterial({
		color: 0xe0e0e0,
		metalness: 0.3,
		roughness: 0.5
	});

	const dummy = new THREE.Object3D();

	// ── Front-face chrome balls at every grid intersection ──
	const ballPositions: [number, number, number][] = [];
	for (const y of lineYs) {
		for (const x of COL_XS) {
			ballPositions.push([x, y, DEPTH]);
		}
	}
	const ballGeom = new THREE.SphereGeometry(BALL_R, 16, 16);
	const ballMesh = new THREE.InstancedMesh(ballGeom, chromeMat, ballPositions.length);
	ballPositions.forEach(([x, y, z], i) => {
		dummy.position.set(x, y, z);
		dummy.scale.set(1, 1, 1);
		dummy.updateMatrix();
		ballMesh.setMatrixAt(i, dummy.matrix);
	});
	ballMesh.instanceMatrix.needsUpdate = true;

	// ── Front-face horizontal tubes (unit-length cylinder, scaled per instance) ──
	const hTubeGeom = new THREE.CylinderGeometry(TUBE_R, TUBE_R, 1, 8);
	hTubeGeom.rotateZ(Math.PI / 2);

	interface TubeInstance {
		pos: [number, number, number];
		scaleLen: number;
	}
	const hTubes: TubeInstance[] = [];
	const dateMidX = (LEFT_X + DIVIDER_X) / 2;
	const contentMidX = (DIVIDER_X + RIGHT_X) / 2;
	const dateLen = DATE_COL_W - 2 * BALL_R;
	const contentLen = CONTENT_COL_W - 2 * BALL_R;
	for (const y of lineYs) {
		hTubes.push({ pos: [dateMidX, y, DEPTH], scaleLen: dateLen });
		hTubes.push({ pos: [contentMidX, y, DEPTH], scaleLen: contentLen });
	}
	const hTubeMesh = new THREE.InstancedMesh(hTubeGeom, chromeMat, hTubes.length);
	hTubes.forEach(({ pos, scaleLen }, i) => {
		dummy.position.set(...pos);
		dummy.scale.set(scaleLen, 1, 1);
		dummy.updateMatrix();
		hTubeMesh.setMatrixAt(i, dummy.matrix);
	});
	hTubeMesh.instanceMatrix.needsUpdate = true;

	// ── Front-face vertical tube segments (unit-height cylinder, scaled per instance) ──
	const vTubeGeom = new THREE.CylinderGeometry(TUBE_R, TUBE_R, 1, 8);
	const vTubes: TubeInstance[] = [];
	for (let i = 0; i < rows.length; i++) {
		const top = lineYs[i];
		const bottom = lineYs[i + 1];
		const midY = (top + bottom) / 2;
		const segH = Math.abs(top - bottom) - 2 * BALL_R;
		for (const x of COL_XS) {
			vTubes.push({ pos: [x, midY, DEPTH], scaleLen: segH });
		}
	}
	const vTubeMesh = new THREE.InstancedMesh(vTubeGeom, chromeMat, vTubes.length);
	vTubes.forEach(({ pos, scaleLen }, i) => {
		dummy.position.set(...pos);
		dummy.scale.set(1, scaleLen, 1);
		dummy.updateMatrix();
		vTubeMesh.setMatrixAt(i, dummy.matrix);
	});
	vTubeMesh.instanceMatrix.needsUpdate = true;

	// ── Horizontal shelf plates (InstancedMesh) ──
	const shelfPlateGeom = new THREE.BoxGeometry(SHELF_W - 2 * PANEL_T, PANEL_T, DEPTH);
	const shelfPlateMesh = new THREE.InstancedMesh(shelfPlateGeom, panelMat, lineYs.length);
	lineYs.forEach((y, i) => {
		dummy.position.set(0, y, DEPTH / 2);
		dummy.scale.set(1, 1, 1);
		dummy.updateMatrix();
		shelfPlateMesh.setMatrixAt(i, dummy.matrix);
	});
	shelfPlateMesh.instanceMatrix.needsUpdate = true;

	// ── Depth tubes at top & bottom corners (6 total) ──
	const depthTubeLen = DEPTH - 2 * BALL_R;
	const depthTubePositions: [number, number, number][] = [];
	for (const x of COL_XS) {
		depthTubePositions.push([x, 0, DEPTH / 2]);
		depthTubePositions.push([x, -totalHeight, DEPTH / 2]);
	}
</script>

<!-- Instanced geometry -->
<T is={ballMesh} />
<T is={hTubeMesh} />
<T is={vTubeMesh} />
<T is={shelfPlateMesh} />

<!-- Structural panels -->
<!-- Left side -->
<T.Mesh position={[LEFT_X, -totalHeight / 2, DEPTH / 2]}>
	<T.BoxGeometry args={[PANEL_T, totalHeight, DEPTH]} />
	<T.MeshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.5} />
</T.Mesh>
<!-- Right side -->
<T.Mesh position={[RIGHT_X, -totalHeight / 2, DEPTH / 2]}>
	<T.BoxGeometry args={[PANEL_T, totalHeight, DEPTH]} />
	<T.MeshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.5} />
</T.Mesh>
<!-- Divider between date & content columns -->
<T.Mesh position={[DIVIDER_X, -totalHeight / 2, DEPTH / 2]}>
	<T.BoxGeometry args={[PANEL_T, totalHeight, DEPTH]} />
	<T.MeshStandardMaterial color="#e0e0e0" metalness={0.3} roughness={0.5} />
</T.Mesh>
<!-- Back panel -->
<T.Mesh position={[0, -totalHeight / 2, PANEL_T / 2]}>
	<T.BoxGeometry args={[SHELF_W, totalHeight, PANEL_T]} />
	<T.MeshStandardMaterial color="#f0ebe5" roughness={0.9} metalness={0} />
</T.Mesh>

<!-- Depth tubes connecting front to back at top & bottom corners -->
{#each depthTubePositions as pos}
	<T.Mesh position={pos} rotation.x={Math.PI / 2}>
		<T.CylinderGeometry args={[TUBE_R, TUBE_R, depthTubeLen, 8]} />
		<T.MeshStandardMaterial color="#d0d0d0" metalness={0.9} roughness={0.15} />
	</T.Mesh>
{/each}
