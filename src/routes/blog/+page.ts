import type { BlogPost } from '$lib/types';

export async function load() {
	const modules = import.meta.glob<{
		metadata: { title: string; date: string; description: string };
	}>('/src/posts/*.md');

	const posts: BlogPost[] = [];

	for (const [path, resolver] of Object.entries(modules)) {
		const { metadata } = await resolver();
		const slug = path.split('/').pop()!.replace('.md', '');
		posts.push({ slug, ...metadata });
	}

	posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { posts };
}
