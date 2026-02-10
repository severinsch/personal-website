<script lang="ts">
	import TimelineItem from '$lib/components/TimelineItem.svelte';
	import { education, experience, skills, achievements, volunteer } from '$lib/content/cv';
</script>

<svelte:head>
	<title>CV — Severin Schmidmeier</title>
	<meta
		name="description"
		content="CV of Severin Schmidmeier — education, experience, and skills."
	/>
</svelte:head>

<h1 class="mb-12 text-3xl font-bold">Curriculum Vitae</h1>

<!-- Education -->
<section class="mb-12">
	<div class="mb-6 flex items-center gap-3">
		<div class="flex h-6 w-6 items-center justify-center">
			<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		</div>
		<h2 class="text-xl font-semibold">Education</h2>
	</div>
	<div class="ml-1.5 border-l-2 border-walnut/10">
		{#each education as edu}
			<TimelineItem
				title={edu.degree}
				subtitle={edu.institution}
				period={edu.period}
				location={edu.location}
				bullets={edu.grade ? [`Grade: ${edu.grade}`] : []}
			/>
		{/each}
	</div>
</section>

<!-- Experience -->
<section class="mb-12">
	<div class="mb-6 flex items-center gap-3">
		<div class="flex h-6 w-6 items-center justify-center">
			<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		</div>
		<h2 class="text-xl font-semibold">Experience</h2>
	</div>
	<div class="ml-1.5 border-l-2 border-walnut/10">
		{#each experience as exp}
			<TimelineItem
				title={exp.title}
				subtitle={exp.company}
				period={exp.period}
				location={exp.location}
				bullets={exp.bullets}
			/>
		{/each}
	</div>
</section>

<!-- Skills -->
<section class="mb-12">
	<div class="mb-6 flex items-center gap-3">
		<div class="flex h-6 w-6 items-center justify-center">
			<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		</div>
		<h2 class="text-xl font-semibold">Technical Skills</h2>
	</div>
	<div class="space-y-4">
		{#each skills as group}
			<div>
				<h3 class="mb-2 text-sm font-semibold text-clay">{group.category}</h3>
				<div class="flex flex-wrap gap-2">
					{#each group.items as item}
						<span class="rounded-full bg-olive/15 px-3 py-1 text-sm font-medium text-olive">
							{item}
						</span>
					{/each}
				</div>
			</div>
		{/each}
	</div>
</section>

<!-- Achievements -->
<section class="mb-12">
	<div class="mb-6 flex items-center gap-3">
		<div class="flex h-6 w-6 items-center justify-center">
			<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		</div>
		<h2 class="text-xl font-semibold">Achievements & Honors</h2>
	</div>
	<ul class="space-y-3">
		{#each achievements as a}
			<li class="flex gap-2 text-walnut/80">
				<span class="mt-2 block h-1.5 w-1.5 flex-shrink-0 rounded-full bg-mustard/50"></span>
				<div>
					<span class="font-medium text-espresso">{a.title}</span>
					<span class="text-sm text-clay"> — {a.detail}</span>
				</div>
			</li>
		{/each}
	</ul>
</section>

<!-- Volunteer -->
<section class="mb-12">
	<div class="mb-6 flex items-center gap-3">
		<div class="flex h-6 w-6 items-center justify-center">
			<div class="h-2 w-2 rotate-45 bg-mustard"></div>
		</div>
		<h2 class="text-xl font-semibold">Volunteer Work</h2>
	</div>
	<div class="ml-1.5 border-l-2 border-walnut/10">
		{#each volunteer as vol}
			<TimelineItem
				title={vol.role}
				subtitle={vol.organization}
				period={vol.period}
				location={vol.location}
				bullets={vol.bullets}
			/>
		{/each}
	</div>
</section>
