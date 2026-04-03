<script lang="ts">
	import { page } from '$app/state';
	import { browser } from '$app/environment';

	const links = [
		{ href: '/', label: 'Home' },
		{ href: '/projects', label: 'Projects' },
		{ href: '/cv', label: 'CV' },
		{ href: '/blog', label: 'Blog' }
	];

	let menuOpen = $state(false);
	let dark = $state(false);

	$effect(() => {
		if (!browser) return;

		dark = document.documentElement.classList.contains('dark');

		const observer = new MutationObserver(() => {
			dark = document.documentElement.classList.contains('dark');
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});

		return () => observer.disconnect();
	});

	function toggleTheme() {
		dark = !dark;
		document.documentElement.classList.toggle('dark', dark);
		localStorage.setItem('theme', dark ? 'dark' : 'light');
	}
</script>

<nav class="border-b border-walnut/10 bg-cream/80 backdrop-blur-sm">
	<div class="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
		<a href="/" class="flex items-center gap-2.5 font-heading text-xl font-bold tracking-tight text-espresso">
			Severin Schmidmeier
		</a>

		<div class="flex items-center gap-4">
			<!-- Desktop links -->
			<ul class="hidden gap-8 sm:flex">
				{#each links as link}
					<li>
						<a
							href={link.href}
							class="text-sm font-medium transition-colors duration-200 {page.url.pathname ===
								link.href ||
							(link.href !== '/' && page.url.pathname.startsWith(link.href))
								? 'text-mustard'
								: 'text-walnut/70 hover:text-mustard'}"
						>
							{link.label}
						</a>
					</li>
				{/each}
			</ul>

			<!-- Dark mode toggle -->
			<button
				onclick={toggleTheme}
				class="rounded-full p-2 text-walnut/70 transition-colors duration-200 hover:text-mustard"
				aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
			>
				<svg class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					{#if dark}
						<circle cx="12" cy="12" r="5" />
						<path
							stroke-linecap="round"
							d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
						/>
					{:else}
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
						/>
					{/if}
				</svg>
			</button>

			<!-- Mobile toggle -->
			<button
				class="text-walnut sm:hidden"
				onclick={() => (menuOpen = !menuOpen)}
				aria-label="Toggle menu"
			>
				<svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
					{#if menuOpen}
						<path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
					{:else}
						<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
					{/if}
				</svg>
			</button>
		</div>
	</div>

	<!-- Mobile menu -->
	{#if menuOpen}
		<ul class="border-t border-walnut/10 px-6 pb-4 sm:hidden">
			{#each links as link}
				<li>
					<a
						href={link.href}
						class="block py-2 text-sm font-medium transition-colors duration-200 {page.url
							.pathname === link.href ||
						(link.href !== '/' && page.url.pathname.startsWith(link.href))
							? 'text-mustard'
							: 'text-walnut/70 hover:text-mustard'}"
						onclick={() => (menuOpen = false)}
					>
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	{/if}
</nav>
