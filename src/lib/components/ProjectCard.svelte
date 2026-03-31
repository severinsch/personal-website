<script lang="ts">
	import type { Project } from '$lib/types';

	let { project, showDetails }: { project: Project, showDetails: boolean } = $props();

</script>

<article
	class="rounded-lg border border-walnut/10 bg-linen p-6 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
>
	<div class="mb-3 flex items-start justify-between gap-4">
		<h3 class="font-heading text-lg font-semibold text-espresso">{project.title}</h3>
		<span class="shrink-0 text-sm text-clay">{project.year}</span>
	</div>

	<p class="mb-4 text-sm leading-relaxed text-walnut/80">{project.description}</p>

	{#if showDetails && project.bullets && project.bullets.length > 0}
		<ul class="mb-4 space-y-1.5">
			{#each project.bullets as bullet}
				<li class="flex gap-2 text-sm text-walnut/70">
					<span class="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-mustard/40"></span>
					{bullet}
				</li>
			{/each}
		</ul>
	{/if}

	<div class="flex flex-wrap gap-2">
		{#each project.tech as tag}
			<span class="rounded-full bg-olive/15 px-2.5 py-0.5 text-xs font-medium text-olive">
				{tag}
			</span>
		{/each}
	</div>

	{#if project.links && project.links.length > 0}
		<div class="mt-4 flex gap-4">
			{#each project.links as link}
				<a
					href={link.href}
					target="_blank"
					rel="noopener noreferrer"
					class="text-sm font-medium text-teal transition-colors duration-200 hover:text-mustard"
				>
					{link.label} &rarr;
				</a>
			{/each}
		</div>
	{/if}
</article>
