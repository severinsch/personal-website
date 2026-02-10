<script lang="ts">
	import type { BlogPost } from '$lib/types';

	let { post }: { post: BlogPost } = $props();

	let formattedDate = $derived(
		new Date(post.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<a
	href="/blog/{post.slug}"
	class="block rounded-lg border border-walnut/5 bg-linen p-6 shadow-sm transition-shadow duration-200 hover:shadow-md"
>
	<time class="text-xs font-medium text-clay">{formattedDate}</time>
	<h3 class="mt-1 font-heading text-lg font-semibold text-espresso">{post.title}</h3>
	<p class="mt-2 text-sm leading-relaxed text-walnut/80">{post.description}</p>
	<span class="mt-3 inline-block text-sm font-medium text-teal">Read more &rarr;</span>
</a>
