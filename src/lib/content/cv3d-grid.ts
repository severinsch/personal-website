import { education, experience, skills, achievements, volunteer } from './cv';

// ── Real USM Haller dimensions (metres) ──
export const TUBE_R = 0.0095; // 19 mm chrome tube
export const BALL_R = 0.0125; // 25 mm ball connector
export const ROW_H = 0.35;
export const DEPTH = 0.35;
export const FOOT_H = 0.045; // levelling glides below the bottom ball
export const PANEL_T = 0.003;
export const DOOR_T = 0.012;
export const DOOR_GAP = TUBE_R + 0.003; // door edge → tube centreline

// ── Sections & USM colours (approximations of the official RAL palette) ──
export type SectionId = 'education' | 'experience' | 'volunteer' | 'awards' | 'skills';

export interface Section {
	id: SectionId;
	label: string;
	color: string; // door colour
	ink: string; // printing colour on a door of this colour
	ui: string; // accent for dots, bars and bullets (white doors need something visible)
}

export const sections: Record<SectionId, Section> = {
	education: {
		id: 'education',
		label: 'Education',
		color: '#2a2b2e',
		ink: '#ebe9e4',
		ui: '#3a3b3f'
	},
	experience: {
		id: 'experience',
		label: 'Experience',
		color: '#ebeae5',
		ink: '#2a2622',
		ui: '#9e968a'
	},
	volunteer: {
		id: 'volunteer',
		label: 'Volunteering',
		color: '#2d6644',
		ink: '#f2f0e8',
		ui: '#2d6644'
	},
	awards: { id: 'awards', label: 'Awards', color: '#e0a526', ink: '#2a1f1f', ui: '#d69b1c' },
	skills: { id: 'skills', label: 'Skills', color: '#9a1e31', ink: '#f8eeee', ui: '#9a1e31' }
};

export const sectionOrder: SectionId[] = [
	'education',
	'experience',
	'volunteer',
	'awards',
	'skills'
];

export interface CVItem {
	id: string;
	section: SectionId;
	index: number; // 1-based within section
	sectionCount: number;
	doorLabel: string; // big print on the door
	doorSub: string; // small print on the door
	title: string;
	subtitle?: string;
	period?: string;
	location?: string;
	bullets: string[];
	tags?: string[];
}

/** "May 2022 – Sep. 2024" → "2022–24", "since 2023" stays */
function shortPeriod(p: string): string {
	const years = p.match(/\d{4}/g);
	if (!years) return p;
	if (p.startsWith('since')) return p;
	if (years.length === 1 || years[0] === years[1]) return years[0];
	return `${years[0]}–${years[1].slice(2)}`;
}

const expShort = ['Amazon', 'revel8', 'ICONPARC', 'TUM', 'TNG', 'TUM'];
const expRole = [
	'SDE Intern',
	'Working Student',
	'Junior SWE',
	'Student Assistant',
	'Junior Professional',
	'Organizer & Tutor'
];
const eduShort = ['M.Sc. Informatics', 'Exchange Semester', 'B.Sc. Informatics'];
const eduInst = ['TUM', 'UTokyo', 'TUM'];

function withCounts(list: Omit<CVItem, 'index' | 'sectionCount'>[]): CVItem[] {
	return list.map((it, i) => ({ ...it, index: i + 1, sectionCount: list.length }));
}

export const items: CVItem[] = [
	...withCounts(
		education.map((e, i) => ({
			id: `edu-${i}`,
			section: 'education' as const,
			doorLabel: eduShort[i] ?? e.degree,
			doorSub: `${eduInst[i] ?? e.institution} · ${shortPeriod(e.period)}`,
			title: e.degree,
			subtitle: e.institution,
			period: e.period,
			location: e.location,
			bullets: e.grade ? [`Grade: ${e.grade}`] : []
		}))
	),
	...withCounts(
		experience.map((e, i) => ({
			id: `exp-${i}`,
			section: 'experience' as const,
			doorLabel: expShort[i] ?? e.company,
			doorSub: `${expRole[i] ?? e.title} · ${shortPeriod(e.period)}`,
			title: e.title,
			subtitle: e.company,
			period: e.period,
			location: e.location,
			bullets: e.bullets
		}))
	),
	...withCounts(
		volunteer.map((v, i) => ({
			id: `vol-${i}`,
			section: 'volunteer' as const,
			doorLabel: 'DPSG',
			doorSub: `${v.role} · ${v.period}`,
			title: v.role,
			subtitle: v.organization,
			period: v.period,
			location: v.location,
			bullets: v.bullets
		}))
	),
	...withCounts([
		{
			id: 'awards',
			section: 'awards' as const,
			doorLabel: 'Awards',
			doorSub: achievements.map((a) => a.title).join(' · '),
			title: 'Awards & Achievements',
			bullets: achievements.map((a) => `${a.title} — ${a.detail}`)
		}
	]),
	...withCounts(
		skills.map((g, i) => ({
			id: `skill-${i}`,
			section: 'skills' as const,
			doorLabel: g.category === 'Other' ? 'Tools & Topics' : g.category,
			doorSub: g.items.slice(0, 3).join(', ') + ' …',
			title: g.category === 'Other' ? 'Tools & Topics' : g.category,
			bullets: [],
			tags: g.items
		}))
	)
];

// ── Layout ──
export interface Slot {
	item: CVItem;
	col: number;
	row: number; // 0 = top
	x: number; // centre
	y: number; // centre
	w: number;
	h: number;
}

export interface ShelfLayout {
	orientation: 'landscape' | 'portrait';
	xs: number[]; // column boundaries, left → right
	ys: number[]; // row lines, top → bottom
	width: number;
	height: number; // incl. feet
	slots: Slot[];
}

export function buildLayout(orientation: 'landscape' | 'portrait'): ShelfLayout {
	// Landscape: a 5-wide sideboard, wider 750 mm modules for the experience columns.
	// Portrait: a 3-wide highboard of 500 mm modules.
	const colWidths = orientation === 'landscape' ? [0.5, 0.75, 0.75, 0.5, 0.5] : [0.5, 0.5, 0.5];
	const rows = Math.ceil(items.length / colWidths.length);

	const width = colWidths.reduce((a, b) => a + b, 0);
	const xs = [-width / 2];
	for (const w of colWidths) xs.push(xs[xs.length - 1] + w);

	const top = FOOT_H + rows * ROW_H;
	const ys = Array.from({ length: rows + 1 }, (_, r) => top - r * ROW_H);

	const slots: Slot[] = items.map((item, i) => {
		const col = Math.floor(i / rows);
		const row = i % rows;
		return {
			item,
			col,
			row,
			x: (xs[col] + xs[col + 1]) / 2,
			y: (ys[row] + ys[row + 1]) / 2,
			w: colWidths[col],
			h: ROW_H
		};
	});

	return { orientation, xs, ys, width, height: top, slots };
}
