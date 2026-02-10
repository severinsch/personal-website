<script lang="ts">
	import ProjectCard from '$lib/components/ProjectCard.svelte';
	import { projects } from '$lib/content/projects';
</script>

<svelte:head>
	<title>Projects — Severin Schmidmeier</title>
	<meta name="description" content="Projects by Severin Schmidmeier." />
</svelte:head>

<h1 class="mb-12 text-3xl font-bold">Projects</h1>

<div class="grid gap-6">
	{#each projects as project}
		<ProjectCard {project} />
	{/each}
</div>
