<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects } from '$lib/content/projects';

	const featured = projects.slice(0, 3);
</script>

<svelte:head>
	<title>Severin Schmidmeier</title>
	<meta
		name="description"
		content="Personal website of Severin Schmidmeier — software engineer and CS master's student at TUM."
	/>
</svelte:head>

<!-- Hero -->
<section class="py-12 sm:py-20">
	<h1 class="mb-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
		Severin
		<br />
		Schmidmeier
	</h1>
	<p class="mb-6 text-lg text-clay">Software Engineer & Computer Science Student</p>
	<p class="max-w-xl leading-relaxed text-walnut/80">
		I'm a master's student in Informatics at the Technical University of Munich. I build software,
		enjoy tackling security challenges, and contribute to my local scout community through both
		technology and leadership.
	</p>
</section>

<!-- Starburst divider -->
<div class="mb-12 flex items-center justify-center gap-3">
	<div class="h-px flex-1 bg-walnut/10"></div>
	<svg class="h-4 w-4 text-mustard" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" fill-rule="evenodd" />
	</svg>
	<div class="h-px flex-1 bg-walnut/10"></div>
</div>

<!-- Featured Projects -->
<section class="mb-16">
	<div class="mb-8 flex items-center gap-3">
		<div class="flex h-6 w-6 items-center justify-center">
			<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		</div>
		<h2 class="text-xl font-semibold">Featured Projects</h2>
	</div>
	<div class="grid gap-6">
		{#each featured as project}
			<ProjectCard {project} />
		{/each}
	</div>
	<div class="mt-6 text-center">
		<a
			href="/projects"
			class="text-sm font-medium text-teal transition-colors duration-200 hover:text-mustard"
		>
			View all projects &rarr;
		</a>
	</div>
</section>

<!-- Latest Posts preview -->
<section>
	<div class="mb-8 flex items-center gap-3">
		<div class="flex h-6 w-6 items-center justify-center">
			<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		</div>
		<h2 class="text-xl font-semibold">Latest Posts</h2>
	</div>
	<p class="text-sm text-clay">
		Coming soon. Check back later or visit the
		<a href="/blog" class="text-teal transition-colors duration-200 hover:text-mustard">blog</a>
		page.
	</p>
</section>
