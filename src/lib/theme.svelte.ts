import { browser } from '$app/environment';

export function createThemeState() {
	let dark = $state(false);

	// Switch clicks via Web Audio: decoded once, then each click is a fresh buffer source.
	// (An <audio> element replayed with currentTime = 0 clicks twice on its first play: the
	// seek is deferred until the file has loaded and lands after playback has started.)
	type Clip = 'on' | 'off';
	let audioCtx: AudioContext | undefined;
	let files: Record<Clip, Promise<ArrayBuffer>> | undefined;
	const decoded: Partial<Record<Clip, Promise<AudioBuffer>>> = {};
	async function click(which: Clip) {
		if (!files) return;
		const ctx = (audioCtx ??= new AudioContext()); // created inside the click, so it may play
		const buffer = await (decoded[which] ??= files[which].then((b) => ctx.decodeAudioData(b)));
		const source = ctx.createBufferSource();
		source.buffer = buffer;
		source.connect(ctx.destination);
		source.start();
	}

	if (browser) {
		dark = document.documentElement.classList.contains('dark');

		const load = (url: string) => fetch(url).then((r) => r.arrayBuffer());
		files = { on: load('/sounds/switch_on.webm'), off: load('/sounds/switch_off.webm') };

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

			click(dark ? 'on' : 'off').catch(() => {});
		}
	};
}

export const theme = createThemeState();
