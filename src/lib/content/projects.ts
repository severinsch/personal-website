import type { Project } from '$lib/types';

export const projects: Project[] = [
	{
		id: 'material-management',
		title: 'Material Management Tool',
		description:
			'A tool to manage the inventory of a scout group, register damages, create packing lists, and more.',
		tech: ['Kotlin', 'TypeScript', 'Svelte', 'Docker', 'Postgres'],
		year: 2025,
		bullets: [
			'Developed a tool to manage the inventory of a scout group, register damages, create packing lists, and more',
			'Designed Kotlin API, Postgres schemata, and Svelte frontend'
		]
	},
	{
		id: 'hacking-challenges',
		title: 'Network Security Hacking Challenges',
		description:
			'A set of CTF-style challenges on various topics to accompany a network security lecture.',
		tech: ['Python', 'Cryptography'],
		year: 2024,
		bullets: [
			'Developed a set of CTF-style challenges on various topics to accompany a network security lecture',
			'Designed complex and interesting challenges & implemented challenge servers and example solutions'
		]
	},
	{
		id: 'dpsg-letter',
		title: 'DPSG Letter',
		description:
			'A tool to allow non-technical users to generate custom letters from a LaTeX template.',
		tech: ['Kotlin', 'TypeScript', 'Svelte', 'Docker', 'LaTeX'],
		year: 2024,
		bullets: [
			'Developed a tool to allow non-technical users to generate custom letters from a LaTeX template',
			'Built a Kotlin API handling the LaTeX generation using pandoc and custom Lua filters & designed a frontend for the tool'
		]
	},
	{
		id: 'personal-website',
		title: 'Personal Website',
		description: 'A basic but beautiful personal website to showcase projects and my CV.',
		tech: ['TypeScript', 'Svelte', 'Threlte/ThreeJS', 'Docker'],
		year: 2026,
		bullets: [
			'Designed a small website inspired by classic interior design',
			'Experimented with Threlte/ThreeJS to implement an interactive fun CV viewer'
		]
	}
];
