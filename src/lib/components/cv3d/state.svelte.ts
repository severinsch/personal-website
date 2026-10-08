import type { SectionId, ShelfLayout } from '$lib/content/cv3d-grid';

export const cv = $state({
	focused: null as string | null,
	hovered: null as string | null,
	section: null as SectionId | null, // legend hover highlight
	sheetPxH: 420, // measured size of the sheet DOM
	sheetPxW: 560
});

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
