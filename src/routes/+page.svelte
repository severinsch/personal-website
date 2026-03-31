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
<section class="relative overflow-hidden py-16 sm:py-28">
	<!-- Background decorative starburst -->
	<!-- <div class="pointer-events-none absolute -right-8 -top-8 opacity-[0.06]" aria-hidden="true">
		<svg class="h-72 w-72 text-mustard" viewBox="0 0 24 24" fill="currentColor">
			<path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" fill-rule="evenodd" />
		</svg>
	</div> -->

	<div class="relative">
		<!-- Eyebrow label -->
		<div class="mb-5 flex items-center gap-3">
			<div class="h-px w-6 bg-mustard"></div>
			<span class="text-xs font-semibold uppercase tracking-[0.18em] text-mustard">
				Software Engineer & CS Student
			</span>
		</div>

		<!-- Display name -->
		<h1
			class="mb-7 font-heading text-6xl font-black leading-none tracking-tight text-espresso sm:text-8xl"
		>
			Severin<br />Schmidmeier
		</h1>

		<!-- Bio -->
		<p class="mb-9 max-w-lg leading-relaxed text-walnut/75">
			Master's student in Informatics at TUM. I build reliable software, enjoy tackling security
			challenges, and contribute to my local scout community through technology and leadership.
		</p>

		<!-- CTA row -->
		<div class="flex flex-wrap items-center gap-3">
			<a
				href="/cv"
				class="rounded-full bg-espresso px-6 py-2.5 text-sm font-medium text-cream transition-colors duration-200 hover:bg-walnut"
			>
				Curriculum Vitae
			</a>
			<a
				href="/projects"
				class="rounded-full border border-walnut/30 px-6 py-2.5 text-sm font-medium text-walnut transition-all duration-200 hover:border-walnut/60 hover:bg-linen"
			>
				See Projects
			</a>
		</div>
	</div>
</section>

<!-- Starburst divider -->
<div class="mb-14 flex items-center justify-center gap-3">
	<div class="h-px flex-1 bg-walnut/10"></div>
	<svg class="h-4 w-4 text-mustard" viewBox="0 0 24 24" fill="currentColor">
		<path d="M12 0l2.5 9.5L24 12l-9.5 2.5L12 24l-2.5-9.5L0 12l9.5-2.5z" fill-rule="evenodd" />
	</svg>
	<div class="h-px flex-1 bg-walnut/10"></div>
</div>

<!-- Featured Projects -->
<section class="mb-16">
	<div class="mb-8 flex items-center gap-4">
		<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		<h2 class="text-xl font-semibold">Featured Projects</h2>
		<div class="h-px flex-1 bg-walnut/10"></div>
	</div>
	<div class="grid gap-6">
		{#each featured as project}
			<ProjectCard project={project} showDetails={false} />
		{/each}
	</div>
	<div class="mt-8 text-center">
		<a
			href="/projects"
			class="text-sm font-medium text-teal transition-colors duration-200 hover:text-mustard"
		>
			View all projects &rarr;
		</a>
	</div>
</section>

<!-- Currently -->
<section>
	<div class="mb-8 flex items-center gap-4">
		<div class="h-3 w-3 rotate-45 bg-mustard"></div>
		<h2 class="text-xl font-semibold">Currently</h2>
		<div class="h-px flex-1 bg-walnut/10"></div>
	</div>
	<ul class="space-y-3">
		<li class="flex items-start gap-3 text-sm text-walnut/80">
			<span class="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-mustard/60"></span>
			<span
				>Finishing my M.Sc. in Informatics at the
				<span class="font-medium text-walnut">Technical University of Munich</span></span
			>
		</li>
		<li class="flex items-start gap-3 text-sm text-walnut/80">
			<span class="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-mustard/60"></span>
			<span
				>Working as a software engineering student at
				<span class="font-medium text-walnut">revel8 GmbH</span> in Munich</span
			>
		</li>
		<li class="flex items-start gap-3 text-sm text-walnut/80">
			<span class="mt-1.5 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-mustard/60"></span>
			<span
				>Leading the <span class="font-medium text-walnut">DPSG Langenbach</span> scout group as
				chairman</span
			>
		</li>
	</ul>
</section>
