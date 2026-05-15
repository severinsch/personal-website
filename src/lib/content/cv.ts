import type { Education, Experience, Volunteer, Achievement, SkillGroup } from '$lib/types';

export const education: Education[] = [
	{
		institution: 'Technical University of Munich',
		degree: 'M.Sc., Informatics',
		grade: '1.1',
		period: 'since 2023'
	},
	{
		institution: 'The University of Tokyo',
		degree: 'Exchange Semester, Informatics',
		grade: '1.0',
		period: '2024 – 2025'
	},
	{
		institution: 'Technical University of Munich',
		degree: 'B.Sc., Informatics',
		grade: '1.6',
		period: '2019 – 2023'
	}
];

export const experience: Experience[] = [
	{
		title: 'Working Student Software Engineering',
		company: 'revel8 GmbH',
		period: 'Apr. 2026 – Present',
		location: 'Munich',
		bullets: [
			'Developed a learning platform for companies to train their employees on IT security topics',
			'Used & benchmarked LLMs to assist companies in creating high quality learning content'
		]
	},
	{
		title: 'Junior Software Engineer',
		company: 'ICONPARC GmbH',
		period: 'Sep. 2025 – Mar. 2026',
		location: 'Munich',
		bullets: [
			'Developed reliable B2B applications using a proprietary DSL and Java',
			'Worked with complex relational database schemata',
			'Developed an LSP server for the used DSL'
		]
	},
	{
		title: 'Student Assistant',
		company: 'Technical University of Munich',
		period: 'May 2025 – Aug. 2025',
		location: 'Garching',
		bullets: [
			'Assistant at the "Chair of Network Architectures and Services"',
			'Continuing the development of CTF challenges on various topics, including security protocols and cryptography',
			'Implementing the challenges and solutions using Python'
		]
	},
	{
		title: 'Junior Professional',
		company: 'TNG Technology Consulting GmbH',
		period: 'May 2022 – Sep. 2024',
		location: 'Munich',
		bullets: [
			'Developed backend software, APIs, and data syncing tools in Python and Go',
			'Developed frontends for e.g., HR management using TypeScript',
			'Worked on the infrastructure setup, including AWS, Kubernetes, and Terraform'
		]
	},
	{
		title: 'Organizer (Übungsleitung) & Student Tutor',
		company: 'Technical University of Munich',
		period: 'Nov. 2020 – May 2022',
		location: 'Garching',
		bullets: [
			'Co-managing the course "Functional Programming and Verification":',
			'Creating exercises and tests in OCaml. Organizing tutorials. Designing and grading exam.',
			'Tutor for "Fundamentals of Programming" and "Introduction to Computer Networking and Distributed Systems":',
			'Teaching students the basics of first Java programming and later networking and distributed systems'
		]
	}
];

export const skills: SkillGroup[] = [
	{
		category: 'Languages',
		items: ['Python', 'Kotlin', 'Go', 'TypeScript', 'SQL', 'Java', 'C++', 'Haskell', 'C']
	},
	{
		category: 'Frameworks',
		items: ['Ktor', 'Exposed', 'Svelte', 'FastAPI', 'React']
	},
	{
		category: 'Other',
		items: ['Docker', 'Cryptography', 'IT Security', 'git', 'Linux', 'LaTeX']
	}
];

export const achievements: Achievement[] = [
	{
		title: 'Deutschlandstipendium',
		detail: '2021, 2022, 2023, 2024, 2025'
	},
	{
		title: 'h4tum CTF',
		detail: '2nd place in a university-wide IT security competition'
	}
];

export const volunteer: Volunteer[] = [
	{
		role: 'Chairman',
		organization: 'Deutsche Pfadfinderschaft Sankt Georg (DPSG)',
		period: 'since 2021',
		location: 'Langenbach',
		bullets: ['Chairman of the local scout group DPSG Langenbach']
	},
	{
		role: 'Youth Group Leader',
		organization: 'Deutsche Pfadfinderschaft Sankt Georg (DPSG)',
		period: 'since 2018',
		location: 'Langenbach',
		bullets: ['Planning & Organizing weekly meetings with children & teenagers']
	}
];
