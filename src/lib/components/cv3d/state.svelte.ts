import type { SectionId, ShelfLayout } from '$lib/content/cv3d-grid';

export const cv = $state({
	focused: null as string | null,
	hovered: null as string | null,
	section: null as SectionId | null, // legend hover highlight
	sheetPxH: 420, // measured size of the sheet DOM
	sheetPxW: 560,
	contextLost: false // the GPU dropped our WebGL context (driver reset, OOM, …)
});

// Phones and tablets: lower resolution, smaller shadow maps, fewer shadow-casting lights
export const lowPower =
	typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches;

// Shadows don't depend on the camera, so they're only redrawn for a while after something that
// casts them changes (a door swinging, the lamp fading). Bump this to keep them live.
export const shadows = { liveUntil: 0 };
export function refreshShadows(ms = 1500) {
	shadows.liveUntil = Math.max(shadows.liveUntil, performance.now() + ms);
}

// Non-reactive per-frame input shared between the DOM wrapper and the camera rig
export const input = {
	px: 0, // pointer, normalised −1…1
	py: 0,
	dragYaw: 0,
	dragPitch: 0,
	dragging: false,
	wasDrag: false,
	doorClicked: false
};

export function neighbour(layout: ShelfLayout, id: string, dir: 'prev' | 'next' | 'up' | 'down') {
	const i = layout.slots.findIndex((s) => s.item.id === id);
	if (i < 0) return id;
	const s = layout.slots[i];
	const n = layout.slots.length;
	if (dir === 'prev') return layout.slots[(i - 1 + n) % n].item.id;
	if (dir === 'next') return layout.slots[(i + 1) % n].item.id;
	const row = s.row + (dir === 'up' ? -1 : 1);
	return layout.slots.find((o) => o.col === s.col && o.row === row)?.item.id ?? id;
}
