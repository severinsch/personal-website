import { education, experience, skills, achievements, volunteer } from './cv';

// ── Shelf dimensions ──
export const COL_W = 6.0; // width of one column
export const N_COLS = 3; // Education · Experience · Volunteer+Skills
export const ENTRY_H = 2.0;
export const HEADER_H = 0.7;
export const DEPTH = 2.2;
export const PANEL_T = 0.03;
export const BALL_R = 0.07;
export const TUBE_R = 0.025;

// Shelf is centered at x = 0; columns span LEFT_START_X … LEFT_START_X + N_COLS * COL_W
export const LEFT_START_X = -(N_COLS * COL_W) / 2; // = -9

// ── USM Haller colours ──
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

export interface ColumnData {
	colIndex: number;
	leftX: number;
	rightX: number;
	rows: RowInfo[];
	lineYs: number[]; // y of every horizontal shelf edge, top → bottom (bottom-aligned)
	totalH: number; // total content height of this column
	topColor: string; // colour of the topmost plate (first section's entry colour)
}

// Each column is defined by one or more sections stacked vertically
interface SectionDef {
	label: string;
	entries: ShelfEntry[];
}

// ── Column definitions ──
const columnDefs: SectionDef[][] = [
	// Column 0 — Education
	[
		{
			label: 'Education',
			entries: education.map((e) => ({
				title: e.degree,
				subtitle: e.institution,
				period: e.period,
				bullets: e.grade ? [`Grade: ${e.grade}`] : [],
				color: USM_GREEN
			}))
		}
	],
	// Column 1 — Experience
	[
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
		}
	],
	// Column 2 — Volunteer + Skills (two sections, separated by a shelf plate)
	[
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
			label: 'Skills',
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
	]
];

// ── Build column layout ──
function buildColumns(): ColumnData[] {
	// First pass: build each column starting at y = 0
	const rawCols = columnDefs.map((sections, colIndex) => {
		const rows: RowInfo[] = [];
		const lineYs: number[] = [0];
		let y = 0;

		for (const section of sections) {
			const headerTop = y;
			y -= HEADER_H;
			rows.push({
				centerY: headerTop - HEADER_H / 2,
				topY: headerTop,
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

		const leftX = LEFT_START_X + colIndex * COL_W;
		const topColor = sections[0].entries[0]?.color ?? '#e0e0e0';
		return { colIndex, leftX, rightX: leftX + COL_W, rows, lineYs, totalH: -y, topColor };
	});

	// Second pass: bottom-align — shift shorter columns down so all share y = -maxH
	const maxH = Math.max(...rawCols.map((c) => c.totalH));
	return rawCols.map((col) => {
		const offset = -(maxH - col.totalH);
		return {
			...col,
			lineYs: col.lineYs.map((y) => y + offset),
			rows: col.rows.map((row) => ({
				...row,
				centerY: row.centerY + offset,
				topY: row.topY + offset,
				bottomY: row.bottomY + offset
			}))
		};
	});
}

export const columns = buildColumns();
export const maxHeight = Math.max(...columns.map((c) => c.totalH));
