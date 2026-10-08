<script lang="ts">
	import { T, useTask, useThrelte } from '@threlte/core';
	import { ContactShadows, interactivity } from '@threlte/extras';
	import * as THREE from 'three';
	import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js';
	import ShelfFrame from './ShelfFrame.svelte';
	import ShelfDoor from './ShelfDoor.svelte';
	import SheetView from './SheetView.svelte';
	import Contents from './Contents.svelte';
	import Decor from './Decor.svelte';
	import { DEPTH, type ShelfLayout } from '$lib/content/cv3d-grid';
	import { cv, input } from './state.svelte';
	import { FOV, focusShot, overviewShot, solveShot } from './framing';
	import { theme } from '$lib/theme.svelte';
	import { Spring } from 'svelte/motion';

	let { layout }: { layout: ShelfLayout } = $props();

	interactivity();

	const { renderer, scene, size, invalidate } = useThrelte();

	// Image-based lighting: a neutral studio room for believable chrome
	const pmrem = new THREE.PMREMGenerator(renderer);
	const envTex = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
	scene.environment = envTex;
	// 0 = daylight, 1 = evening (site dark mode): the Akari lamp takes over
	const night = new Spring(theme.isDark ? 1 : 0, { stiffness: 0.05, damping: 0.9 });
	$effect(() => {
		night.target = theme.isDark ? 1 : 0;
	});
	const mix = (a: number, b: number) => a + (b - a) * night.current;
	$effect(() => {
		scene.environmentIntensity = mix(0.45, 0.22);
		invalidate();
	});
	$effect(() => () => {
		scene.environment = null;
		envTex.dispose();
		pmrem.dispose();
	});

	let camera: THREE.PerspectiveCamera | undefined = $state();

	// ── Camera rig: every frame, ease towards the requested shot ──
	const cur = { cx: 0, cy: 0.6, cz: 0, dist: 6, yaw: -0.3, pitch: 0.15, offX: 0, offY: 0 };
	let first = true;
	const v = new THREE.Vector3();

	useTask(
		(dt) => {
			if (!camera) return;
			const { width: W, height: H } = size.current;
			if (!W || !H) return;

			const slot = cv.focused ? layout.slots.find((s) => s.item.id === cv.focused) : undefined;
			const shot = slot
				? focusShot(slot, W, H, { w: cv.sheetPxW, h: cv.sheetPxH })
				: overviewShot(layout, W, H);
			const { dist, offX, offY } = solveShot(shot, W, H);

			// drag springs back once released
			if (!input.dragging) {
				const decay = Math.exp(-dt * 1.6);
				input.dragYaw *= decay;
				input.dragPitch *= decay;
			}
			const sway = slot ? 0.25 : 1;
			const goal = {
				cx: shot.center[0],
				cy: shot.center[1],
				cz: shot.center[2],
				dist,
				yaw: shot.yaw - input.px * 0.07 * sway + input.dragYaw,
				pitch: shot.pitch + input.py * 0.04 * sway + input.dragPitch,
				offX,
				offY
			};

			if (first) {
				// entrance: start further out and swung round, then glide in
				Object.assign(cur, goal, {
					dist: goal.dist * 1.45,
					yaw: goal.yaw - 0.55,
					pitch: goal.pitch + 0.12
				});
				first = false;
			}
			const a = 1 - Math.exp(-Math.min(dt, 0.1) * 3.4);
			let moving = false;
			for (const k of Object.keys(goal) as (keyof typeof goal)[]) {
				const d = goal[k] - cur[k];
				if (Math.abs(d) > 1e-5) moving = true;
				cur[k] += d * a;
			}

			const { yaw, pitch } = cur;
			const dir = [
				Math.sin(yaw) * Math.cos(pitch),
				Math.sin(pitch),
				Math.cos(yaw) * Math.cos(pitch)
			];
			const right = [Math.cos(yaw), 0, -Math.sin(yaw)];
			const up = [
				-Math.sin(yaw) * Math.sin(pitch),
				Math.cos(pitch),
				-Math.cos(yaw) * Math.sin(pitch)
			];
			v.set(
				cur.cx - right[0] * cur.offX - up[0] * cur.offY,
				cur.cy - right[1] * cur.offX - up[1] * cur.offY,
				cur.cz - right[2] * cur.offX - up[2] * cur.offY
			);
			camera.position.set(
				v.x + dir[0] * cur.dist,
				v.y + dir[1] * cur.dist,
				v.z + dir[2] * cur.dist
			);
			camera.lookAt(v);
			if (moving) invalidate();
		},
		{ autoInvalidate: false }
	);

	const shadowSpan = $derived(Math.max(layout.width, layout.height) * 0.75 + 0.6);
	let key: THREE.DirectionalLight | undefined = $state();
	$effect(() => {
		if (!key) return;
		const c = key.shadow.camera;
		c.left = -shadowSpan;
		c.right = shadowSpan;
		c.top = shadowSpan;
		c.bottom = -shadowSpan;
		c.updateProjectionMatrix();
		key.target.position.set(0, layout.height / 2, -DEPTH / 2);
		key.target.updateMatrixWorld();
	});
</script>

<T.PerspectiveCamera bind:ref={camera} makeDefault fov={FOV} near={0.05} far={60} />

<T.HemisphereLight args={['#fffaf2', '#c9bba8']} intensity={mix(0.35, 0.2)} />
<T.DirectionalLight
	bind:ref={key}
	position={[-2.6, layout.height + 3.2, 3.4]}
	intensity={mix(2.0, 0.45)}
	color={theme.isDark ? '#b8c4ff' : '#fff6ea'}
	castShadow
	shadow.mapSize={[2048, 2048]}
	shadow.bias={-0.0003}
	shadow.normalBias={0.015}
	shadow.radius={6}
	shadow.blurSamples={16}
/>
<T.DirectionalLight position={[3, 2, 2.5]} intensity={mix(0.35, 0.08)} color="#e8eeff" />

<ShelfFrame {layout} />
{#each layout.slots as slot (slot.item.id + layout.orientation)}
	<ShelfDoor {slot} />
	<Contents {slot} />
{/each}
<Decor {layout} />
<SheetView {layout} />

<!-- Invisible floor and wall that only catch shadows, so the shelf sits on the page itself -->
<T.Mesh rotation.x={-Math.PI / 2} receiveShadow>
	<T.PlaneGeometry args={[30, 30]} />
	<T.ShadowMaterial opacity={0.16} color="#2a1a0a" />
</T.Mesh>
<T.Mesh position={[0, 0, -DEPTH - 0.06]} receiveShadow>
	<T.PlaneGeometry args={[30, 30]} />
	<T.ShadowMaterial opacity={0.07} color="#2a1a0a" />
</T.Mesh>
<ContactShadows
	position.y={0.0015}
	width={layout.width + 0.8}
	height={DEPTH + 0.8}
	position.z={-DEPTH / 2}
	resolution={512}
	blur={2.4}
	far={0.4}
	opacity={0.55}
	frames={1}
/>
