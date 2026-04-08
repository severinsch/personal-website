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

	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(event: MouseEvent) {
		const currentTarget = event.currentTarget as HTMLElement;
		const rect = currentTarget.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	}
</script>

<a
	href="/blog/{post.slug}"
	onmousemove={handleMouseMove}
	class="group relative block overflow-hidden rounded-lg border border-walnut/10 bg-linen p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
>
	<!-- Spotlight hover effect -->
	<div
		class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
		style="background: radial-gradient(600px circle at {mouseX}px {mouseY}px, rgba(255,255,255,0.1), transparent 40%);"
	></div>

	<div class="relative z-10">
		<time class="text-xs font-medium text-clay">{formattedDate}</time>
		<h3 class="mt-1 font-heading text-lg font-semibold text-espresso">{post.title}</h3>
		<p class="mt-2 text-sm leading-relaxed text-walnut/80">{post.description}</p>
		<span class="mt-3 inline-block text-sm font-medium text-teal">Read more &rarr;</span>
	</div>
</a>
