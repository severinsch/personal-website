<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects } from '$lib/content/projects';
	const sortedProjects = [...projects].sort((a, b) => b.year - a.year);
</script>

<svelte:head>
	<title>Projects — Severin Schmidmeier</title>
	<meta name="description" content="Projects by Severin Schmidmeier." />
	<link rel="canonical" href="https://schmidmeier.dev/projects" />
</svelte:head>

<h1 class="mb-3 text-3xl font-bold">Projects</h1>
<p class="mb-12 text-sm text-clay">
	A selection of things I've built — tools, challenges, and experiments.
</p>

<div class="grid gap-6">
	{#each sortedProjects as project}
		<ProjectCard {project} showDetails={true} />
	{/each}
</div>
