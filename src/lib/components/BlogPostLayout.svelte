<script lang="ts">
	let { title, date, description, children } = $props();
</script>

<svelte:head>
	<title>{title} — Severin Schmidmeier</title>
	<meta name="description" content={description} />
</svelte:head>

<article class="mx-auto max-w-2xl">
	<header class="mb-10">
		<a
			href="/blog"
			class="mb-6 inline-block text-sm text-clay transition-colors duration-200 hover:text-mustard"
		>
			&larr; Back to blog
		</a>
		<h1 class="mb-3 text-3xl font-bold">{title}</h1>
		<time class="text-sm text-clay"
			>{new Date(date).toLocaleDateString('en-US', {
				year: 'numeric',
				month: 'long',
				day: 'numeric'
			})}</time
		>
	</header>

	<div class="prose">
		{@render children()}
	</div>
</article>
