<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects } from '$lib/content/projects';
</script>

<svelte:head>
	<title>Projects — Severin Schmidmeier</title>
	<meta name="description" content="Projects by Severin Schmidmeier." />
</svelte:head>

<h1 class="mb-3 text-3xl font-bold">Projects</h1>
<p class="mb-12 text-sm text-clay">A selection of things I've built — tools, challenges, and experiments.</p>

<div class="grid gap-6">
	{#each projects as project}
		<ProjectCard project={project} showDetails={true} />
	{/each}
</div>
