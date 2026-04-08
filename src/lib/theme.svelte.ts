import { browser } from '$app/environment';

export function createThemeState() {
	let dark = $state(false);

	let audioOn: HTMLAudioElement | undefined;
	let audioOff: HTMLAudioElement | undefined;

	if (browser) {
		dark = document.documentElement.classList.contains('dark');

		audioOn = new Audio('/sounds/switch_on.webm');
		audioOff = new Audio('/sounds/switch_off.webm');
		audioOn.preload = 'auto';
		audioOff.preload = 'auto';

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

			const audio = dark ? audioOn : audioOff;
			if (audio) {
				audio.currentTime = 0;
				audio.play().catch(() => {});
			}
		}
	};
}

export const theme = createThemeState();
