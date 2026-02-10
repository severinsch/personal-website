import type { Project } from '$lib/types';

export const projects: Project[] = [
	{
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
		title: 'DPSG Letter',
		description:
			'A tool to allow non-technical users to generate custom letters from a LaTeX template.',
		tech: ['Kotlin', 'TypeScript', 'Svelte', 'Docker', 'LaTeX'],
		year: 2024,
		bullets: [
			'Developed a tool to allow non-technical users to generate custom letters from a LaTeX template',
			'Built a Kotlin API handling the LaTeX generation using pandoc and custom Lua filters & designed a frontend for the tool'
		]
	}
];
