<script lang="ts">
	let {
		title,
		subtitle,
		period,
		location,
		bullets = []
	}: {
		title: string;
		subtitle: string;
		period: string;
		location?: string;
		bullets?: string[];
	} = $props();
</script>

<div class="relative pl-8">
	<!-- Timeline dot -->
	<div class="absolute top-1.5 left-0 h-3 w-3 rounded-full border-2 border-mustard bg-cream"></div>

	<div class="pb-8">
		<div class="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
			<div>
				<h3 class="text-lg font-semibold text-espresso">{title}</h3>
				<p class="text-sm font-medium text-teal">{subtitle}</p>
			</div>
			<div class="text-sm text-clay sm:text-right">
				<p>{period}</p>
				{#if location}
					<p>{location}</p>
				{/if}
			</div>
		</div>
		{#if bullets.length > 0}
			<ul class="mt-3 space-y-1.5">
				{#each bullets as bullet}
					<li class="flex gap-2 text-sm text-walnut/80">
						<span class="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-mustard/50"></span>
						{bullet}
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</div>
