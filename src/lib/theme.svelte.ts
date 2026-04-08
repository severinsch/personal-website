import { browser } from '$app/environment';

export function createThemeState() {
	let dark = $state(false);

	if (browser) {
		dark = document.documentElement.classList.contains('dark');

		const observer = new MutationObserver(() => {
			dark = document.documentElement.classList.contains('dark');
		});

		observer.observe(document.documentElement, {
			attributes: true,
			attributeFilter: ['class']
		});
	}

	return {
		get isDark() {
			return dark;
		},
		toggle: () => {
			dark = !dark;
			document.documentElement.classList.toggle('dark', dark);
			localStorage.setItem('theme', dark ? 'dark' : 'light');
		}
	};
}

export const theme = createThemeState();
