export interface Education {
	institution: string;
	degree: string;
	grade?: string;
	period: string;
	location?: string;
}

export interface Experience {
	title: string;
	company: string;
	period: string;
	location: string;
	bullets: string[];
}

export interface Volunteer {
	role: string;
	organization: string;
	period: string;
	location: string;
	bullets: string[];
}

export interface Achievement {
	title: string;
	detail: string;
}

export interface SkillGroup {
	category: string;
	items: string[];
}

export interface Project {
	title: string;
	description: string;
	tech: string[];
	year: number;
	bullets: string[];
	links?: { label: string; href: string }[];
}

export interface BlogPost {
	slug: string;
	title: string;
	date: string;
	description: string;
}
