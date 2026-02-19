import { education, experience, skills, achievements, volunteer } from './cv';

// ── Shelf dimensions ──
export const DATE_COL_W = 1.8;
export const CONTENT_COL_W = 5.0;
export const SHELF_W = DATE_COL_W + CONTENT_COL_W;
export const ENTRY_H = 2.0;
export const HEADER_H = 0.7;
export const DEPTH = 0.8;
export const PANEL_T = 0.03;
export const BALL_R = 0.07;
export const TUBE_R = 0.025;

// X positions (shelf centered at x=0)
export const LEFT_X = -SHELF_W / 2;
export const DIVIDER_X = LEFT_X + DATE_COL_W;
export const RIGHT_X = SHELF_W / 2;

// Scroll / camera
export const VISIBLE_H = 8;
export const PX_PER_UNIT = 150;

// ── USM Haller colors ──
const USM_GREEN = '#415D43';
const USM_BLUE = '#3E4A82';
const USM_ORANGE = '#DE6826';
const USM_GOLD = '#D4A017';
const USM_RED = '#9E1E35';

// ── Types ──
export interface ShelfEntry {
	title: string;
	subtitle: string;
	period: string;
	location?: string;
	bullets: string[];
	color: string;
}

export interface RowInfo {
	centerY: number;
	topY: number;
	bottomY: number;
	height: number;
	type: 'header' | 'entry';
	label?: string;
	entry?: ShelfEntry;
}

// ── Build the linear layout ──
function buildLayout() {
	const rows: RowInfo[] = [];
	const lineYs: number[] = [0];
	let y = 0;

	const sections: { label: string; entries: ShelfEntry[] }[] = [
		{
			label: 'Education',
			entries: education.map((e) => ({
				title: e.degree,
				subtitle: e.institution,
				period: e.period,
				bullets: e.grade ? [`Grade: ${e.grade}`] : [],
				color: USM_GREEN
			}))
		},
		{
			label: 'Experience',
			entries: experience.map((e) => ({
				title: e.title,
				subtitle: e.company,
				period: e.period,
				location: e.location,
				bullets: e.bullets,
				color: USM_BLUE
			}))
		},
		{
			label: 'Volunteer',
			entries: volunteer.map((v) => ({
				title: v.role,
				subtitle: v.organization,
				period: v.period,
				location: v.location,
				bullets: v.bullets,
				color: USM_ORANGE
			}))
		},
		{
			label: 'Skills & Achievements',
			entries: [
				{
					title: 'Technical Skills',
					subtitle: '',
					period: '',
					bullets: skills.map((g) => `${g.category}: ${g.items.join(', ')}`),
					color: USM_GOLD
				},
				{
					title: 'Achievements',
					subtitle: '',
					period: '',
					bullets: achievements.map((a) => `${a.title} — ${a.detail}`),
					color: USM_RED
				}
			]
		}
	];

	for (const section of sections) {
		const top = y;
		y -= HEADER_H;
		rows.push({
			centerY: top - HEADER_H / 2,
			topY: top,
			bottomY: y,
			height: HEADER_H,
			type: 'header',
			label: section.label
		});
		lineYs.push(y);

		for (const entry of section.entries) {
			const entryTop = y;
			y -= ENTRY_H;
			rows.push({
				centerY: entryTop - ENTRY_H / 2,
				topY: entryTop,
				bottomY: y,
				height: ENTRY_H,
				type: 'entry',
				entry
			});
			lineYs.push(y);
		}
	}

	return { rows, totalHeight: -y, lineYs };
}

export const { rows, totalHeight, lineYs } = buildLayout();
