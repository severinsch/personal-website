import type { EntryGenerator } from './$types';
import type { SvelteComponent } from 'svelte';

const modules = import.meta.glob<{
	default: typeof SvelteComponent;
	metadata: { title: string; date: string; description: string };
}>('/src/posts/*.md');

export const entries: EntryGenerator = async () => {
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').pop()!.replace('.md', '')
	}));
};

export async function load({ params }: { params: { slug: string } }) {
	const path = `/src/posts/${params.slug}.md`;
	const resolver = modules[path];
	if (!resolver) {
		throw new Error(`Post not found: ${params.slug}`);
	}
	const post = await resolver();
	return {
		content: post.default,
		metadata: post.metadata
	};
}
