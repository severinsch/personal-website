import { DEPTH, type ShelfLayout, type Slot } from '$lib/content/cv3d-grid';

export const FOV = 18; // long lens: little perspective distortion

type V3 = [number, number, number];

export interface Rect {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface Shot {
	center: V3; // pivot point of the shot
	min: V3; // world-space box that must be fully visible inside `rect`
	max: V3;
	rect: Rect; // screen rectangle (px)
	yaw: number;
	pitch: number;
	maxPpu?: number; // cap on pixels per metre at `center` (sheet: keep ~1:1 DOM scale)
}

/** Sheet size in metres (1 DOM px = 1 mm) */
export const PX = 0.001;

/**
 * Where the sheet is presented: pulled up out of the compartment like a hanging file and held
 * just above it, so the text is the focus and the compartment's contents peek out underneath.
 */
export function sheetPose(slot: Slot, sheet: { w: number; h: number }) {
	const overlap = 0.12; // how far the sheet still hangs into the opening
	return { x: slot.x, y: slot.y + slot.h / 2 - overlap + (sheet.h * PX) / 2, z: 0.07, tilt: 0.012 };
}

export function overviewShot(layout: ShelfLayout, W: number, H: number): Shot {
	const top = W < 640 ? 100 : 112;
	const bottom = W < 640 ? 64 : 76;
	const side = W < 640 ? 16 : 40;
	return {
		center: [0, layout.height / 2, -DEPTH / 2],
		min: [-layout.width / 2 - 0.02, 0, -DEPTH],
		max: [layout.width / 2 + 0.02, layout.height + 0.33, 0.02], // incl. the lamp on top
		rect: { x: side, y: top, w: W - 2 * side, h: H - top - bottom },
		yaw: layout.orientation === 'portrait' ? -0.2 : -0.24,
		pitch: 0.13
	};
}

/** Frame the open compartment together with the sheet lifted out of it */
export function focusShot(
	slot: Slot,
	W: number,
	H: number,
	sheetPx: { w: number; h: number }
): Shot {
	const p = sheetPose(slot, sheetPx);
	const sw = (sheetPx.w * PX) / 2;
	const sh = (sheetPx.h * PX) / 2;
	const x0 = Math.min(slot.x - slot.w / 2, p.x - sw) - 0.06;
	const x1 = Math.max(slot.x + slot.w / 2, p.x + sw) + 0.06;
	const y0 = Math.min(slot.y - slot.h / 2, p.y - sh) - 0.05;
	const y1 = Math.max(slot.y + slot.h / 2, p.y + sh) + 0.05;
	return {
		center: [(x0 + x1) / 2, (y0 + y1) / 2, 0],
		min: [x0, y0, p.z],
		max: [x1, y1, p.z],
		rect: { x: 16, y: 64, w: W - 32, h: H - 64 - 76 },
		yaw: 0.04,
		pitch: 0.07,
		maxPpu: 1100
	};
}

function basis(yaw: number, pitch: number) {
	const cy = Math.cos(yaw);
	const sy = Math.sin(yaw);
	const cp = Math.cos(pitch);
	const sp = Math.sin(pitch);
	return {
		dir: [sy * cp, sp, cy * cp] as V3, // target → camera
		right: [cy, 0, -sy] as V3,
		up: [-sy * sp, cp, -cy * sp] as V3
	};
}

const dot = (a: V3, b: V3) => a[0] * b[0] + a[1] * b[1] + a[2] * b[2];

/**
 * Find the closest camera distance (along the yaw/pitch direction) and a screen-plane
 * offset so that every corner of the shot's box projects inside `rect`.
 */
export function solveShot(s: Shot, W: number, H: number) {
	const t = Math.tan(((FOV / 2) * Math.PI) / 180);
	const { dir, right, up } = basis(s.yaw, s.pitch);
	const corners: { r: number; u: number; f: number }[] = [];
	for (const x of [s.min[0], s.max[0]])
		for (const y of [s.min[1], s.max[1]])
			for (const z of [s.min[2], s.max[2]]) {
				const p: V3 = [x - s.center[0], y - s.center[1], z - s.center[2]];
				corners.push({ r: dot(p, right), u: dot(p, up), f: dot(p, dir) });
			}

	// screen x = W/2 + (r + ox) * H / (2 t depth); depth = d − f
	const fit = (d: number) => {
		let oxLo = -Infinity,
			oxHi = Infinity,
			oyLo = -Infinity,
			oyHi = Infinity;
		for (const c of corners) {
			const k = (2 * t * (d - c.f)) / H; // metres per pixel at this corner
			oxLo = Math.max(oxLo, (s.rect.x - W / 2) * k - c.r);
			oxHi = Math.min(oxHi, (s.rect.x + s.rect.w - W / 2) * k - c.r);
			// screen y grows downwards
			oyLo = Math.max(oyLo, (H / 2 - (s.rect.y + s.rect.h)) * k - c.u);
			oyHi = Math.min(oyHi, (H / 2 - s.rect.y) * k - c.u);
		}
		return { ok: oxLo <= oxHi && oyLo <= oyHi, ox: (oxLo + oxHi) / 2, oy: (oyLo + oyHi) / 2 };
	};

	let lo = 0.3;
	let hi = 60;
	for (let i = 0; i < 40; i++) {
		const mid = (lo + hi) / 2;
		if (fit(mid).ok) hi = mid;
		else lo = mid;
	}
	let dist = hi;
	if (s.maxPpu) dist = Math.max(dist, H / (2 * t * s.maxPpu));
	const { ox, oy } = fit(dist);
	return { dist, offX: ox, offY: oy };
}
