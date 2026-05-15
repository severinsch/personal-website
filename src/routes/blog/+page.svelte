<script lang="ts">
	import BlogPostCard from '$lib/components/BlogPostCard.svelte';

	let { data } = $props();
</script>

<svelte:head>
	<title>Blog — Severin Schmidmeier</title>
	<meta name="description" content="Blog posts by Severin Schmidmeier." />
	<link rel="canonical" href="https://schmidmeier.dev/blog" />
</svelte:head>

<h1 class="mb-12 text-3xl font-bold">Blog</h1>

{#if data.posts.length === 0}
	<p class="text-clay">No posts yet. Check back soon!</p>
{:else}
	<div class="grid gap-6">
		{#each data.posts as post}
			<BlogPostCard {post} />
		{/each}
	</div>
{/if}
