<script lang="ts">
	import { sections, type CVItem } from '$lib/content/cv3d-grid';

	let { item }: { item: CVItem } = $props();
	const section = $derived(sections[item.section]);
</script>

<article class="cv-detail" style="--accent: {section.ui}">
	<header>
		<p class="kicker">
			<span class="swatch"></span>
			{section.label}
			<span class="count"
				>{String(item.index).padStart(2, '0')} / {String(item.sectionCount).padStart(2, '0')}</span
			>
		</p>
		<h2>{item.title}</h2>
		{#if item.subtitle}
			<p class="subtitle">{item.subtitle}</p>
		{/if}
		{#if item.period || item.location}
			<dl class="meta">
				{#if item.period}
					<div>
						<dt>Period</dt>
						<dd>{item.period}</dd>
					</div>
				{/if}
				{#if item.location}
					<div>
						<dt>Location</dt>
						<dd>{item.location}</dd>
					</div>
				{/if}
			</dl>
		{/if}
	</header>

	{#if item.bullets.length}
		<ul class="bullets">
			{#each item.bullets as b}
				<li>{b}</li>
			{/each}
		</ul>
	{/if}

	{#if item.tags}
		<ul class="tags">
			{#each item.tags as t}
				<li>{t}</li>
			{/each}
		</ul>
	{/if}
</article>

<style>
	.cv-detail {
		color: var(--color-walnut);
	}
	.kicker {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		font-family: var(--font-mono);
		font-size: 0.7rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-clay);
	}
	.swatch {
		width: 0.6rem;
		height: 0.6rem;
		border-radius: 999px;
		background: var(--accent);
	}
	.count {
		margin-left: auto;
	}
	h2 {
		margin-top: 0.9rem;
		font-family: var(--font-heading);
		font-size: 1.45rem;
		line-height: 1.2;
		font-weight: 700;
		letter-spacing: -0.01em;
		color: var(--color-espresso);
	}
	.subtitle {
		margin-top: 0.3rem;
		font-size: 1rem;
		font-weight: 500;
	}
	.meta {
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem 1.6rem;
		margin-top: 1rem;
		padding-top: 0.85rem;
		border-top: 1px solid color-mix(in srgb, currentColor 14%, transparent);
	}
	dt {
		font-family: var(--font-mono);
		font-size: 0.62rem;
		letter-spacing: 0.14em;
		text-transform: uppercase;
		color: var(--color-clay);
	}
	dd {
		font-size: 0.9rem;
		font-weight: 500;
	}
	.bullets {
		margin-top: 1.1rem;
		display: grid;
		gap: 0.55rem;
		font-size: 0.92rem;
		line-height: 1.55;
	}
	.bullets li {
		position: relative;
		padding-left: 1.1rem;
	}
	.bullets li::before {
		content: '';
		position: absolute;
		left: 0;
		top: 0.62em;
		width: 0.45rem;
		height: 2px;
		background: var(--accent);
	}
	.tags {
		margin-top: 1.1rem;
		display: flex;
		flex-wrap: wrap;
		gap: 0.4rem;
	}
	.tags li {
		padding: 0.25rem 0.65rem;
		border-radius: 999px;
		border: 1px solid color-mix(in srgb, var(--accent) 55%, transparent);
		background: color-mix(in srgb, var(--accent) 12%, transparent);
		font-size: 0.85rem;
		font-weight: 500;
	}
</style>
