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

	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(event: MouseEvent) {
		const currentTarget = event.currentTarget as HTMLElement;
		const rect = currentTarget.getBoundingClientRect();
		mouseX = event.clientX - rect.left;
		mouseY = event.clientY - rect.top;
	}
</script>

<div
	onmousemove={handleMouseMove}
	class="group relative overflow-hidden rounded-lg pl-8 transition-all duration-200"
	role="listitem"
>
	<!-- Spotlight hover effect -->
	<div
		class="pointer-events-none absolute -inset-px rounded-xl opacity-0 transition duration-300 group-hover:opacity-100"
		style="background: radial-gradient(600px circle at {mouseX}px {mouseY}px, rgba(255,255,255,0.05), transparent 40%);"
	></div>

	<!-- Timeline dot -->
	<div
		class="absolute top-2 left-0 z-10 h-3 w-3 rounded-full border-2 border-mustard bg-cream ring-4 ring-cream"
	></div>

	<div class="relative z-10 pb-8 pt-1 pl-2">
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
