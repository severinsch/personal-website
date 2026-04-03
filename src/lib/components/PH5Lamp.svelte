<script lang="ts">
	import { browser } from '$app/environment';

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

<div
	class="lamp-wrapper"
	class:lit={dark}
	onclick={toggleTheme}
	onkeydown={(e) => e.key === 'Enter' && toggleTheme()}
	role="button"
	tabindex="0"
	aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
>
	<svg viewBox="0 -280 972 878" fill="none" xmlns="http://www.w3.org/2000/svg">
		<!-- cable: drawn first so it sits behind the lamp body glow group -->
		<path class="ph5-cable" d="M490 74.5H481V-280H490V74.5Z" />
		<!-- lamp body group: glow applied here so cable is excluded -->
		<g class="ph5-lamp-body">
			<!-- shade-inner first: behind everything in the group -->
			<path
				class="ph5-shade-inner"
				d="M146.603 419.289C25.0029 424.489 -1.39711 430.456 0.602885 432.789C0.735257 435.36 7 440.6 31 441C64.1667 443 131 446.9 133 446.5C195.5 448.333 322.7 451.8 331.5 451H640.5C648.5 453 771 449 774 449C776.693 449 887 444.5 888.5 444.5C890 444.5 943 441.5 959 438.5C971.8 436.1 971.402 433.026 969.603 431.789C910.103 420.789 920.99 425.747 830.103 420.789C775.103 417.789 664.27 414.623 625.103 414.789C606.603 414.623 536.303 414.389 403.103 414.789C236.603 415.289 298.603 412.789 146.603 419.289Z"
			/>
			<!-- shades: middle layer -->
			<path
				class="ph5-shade"
				d="M261.5 238.5L296 242C305.833 246 323.917 256.709 328 260.5C335 267 347 270.5 373 308.5H601C598.5 300 636.5 263 652.5 253.5C668.5 244 680.5 242 680 242C679.6 242 725.5 235.333 748.5 232C757.833 229.667 776.3 223.5 775.5 217.5C774.7 211.5 766.5 207.333 762.5 206C749.167 203.333 712.2 197 671 193C629.8 189 576.833 186 555.5 185H415C387.333 186 323 189 287 193C242 198 223 202.5 211.5 206C200 209.5 193.5 214.5 196.5 220.5C198.9 225.3 215.167 230.167 223 232L261.5 238.5Z"
			/>
			<path
				class="ph5-shade"
				d="M0.99998 432.5C-1.00002 430.167 25.4 424.2 147 419C299 412.5 237 415 403.5 414.5C536.7 414.1 607 414.333 625.5 414.5C664.667 414.333 775.5 417.5 830.5 420.5C921.387 425.457 910.5 420.5 970 431.5C961.667 425.333 933.2 407.4 886 385C827 357 797 343.5 786.5 341C776 338.5 752.5 326 712 320.5C671.5 315 716 318.5 622.5 311.5C537 305.099 366.5 308 329.5 311.5C319.333 312.167 286.2 315.8 235 325C171 336.5 21 413.5 0.99998 432.5Z"
			/>
			<path
				class="ph5-shade"
				d="M281 548H690.5C685.167 518.833 661.8 454.6 611 431L487 427L362 431C306.4 457.8 284.833 520.167 281 548Z"
			/>
			<path
				class="ph5-shade"
				d="M592.5 597.5H379.5C376 582.167 369.2 550.9 370 548.5H600.5C601.3 550.5 595.5 582 592.5 597.5Z"
			/>
			<path
				class="ph5-shade"
				d="M416.5 184.5L419 87.5C419 83.6667 432.3 75.8 485.5 75C538.7 74.2 553 83 553.5 87.5L555 184.5H416.5Z"
			/>
			<!-- bars last: foreground within the group -->
			<path
				class="ph5-bars"
				d="M340.593 443L349.093 437C348.293 437 341.426 422.333 338.093 415H325.593C324.393 415 335.093 433.667 340.593 443Z"
			/>
			<path
				class="ph5-bars"
				d="M631 443L622.5 437C623.3 437 630.167 422.333 633.5 415H646C647.2 415 636.5 433.667 631 443Z"
			/>
			<path class="ph5-bars" d="M480.5 415H491.5V448L486 449L480.5 448V415Z" />
			<path class="ph5-bars" d="M491.5 217H481V307.5H491.5V217Z" />
			<path
				class="ph5-bars"
				d="M318.5 312.5C319.7 285.3 324.667 266.5 327 260.5L320 255.5C311.2 278.3 309 303.667 309 313.5L318.5 312.5Z"
			/>
			<path
				class="ph5-bars"
				d="M652 313C650.8 285.8 645.833 267 643.5 261L650.5 256C659.3 278.8 661.5 304.167 661.5 314L652 313Z"
			/>
		</g>
	</svg>
</div>

<style>
	.lamp-wrapper {
		position: fixed;
		top: 0;
		left: 0;
		/* Cable sits at ~50% of SVG width, target ~11vw from left edge */
		transform: translateX(calc(-50% + clamp(110px, 11vw, 180px)));
		width: clamp(200px, 20vw, 340px);
		cursor: pointer;
		z-index: 10;
		transition: opacity 0.4s ease;
	}

	/* Only show when viewport is wide enough for the lamp to sit
	   comfortably in the left gutter without overlapping content */
	@media (max-width: 1280px) {
		.lamp-wrapper {
			opacity: 0;
			pointer-events: none;
		}
	}

	svg {
		overflow: visible;
	}

	.ph5-lamp-body {
		transition: filter 0.4s ease-in-out;
	}

	/* ── Light mode (base) — cold white, lamp off ──────────────── */

	.ph5-shade {
		fill: #eceff6;
		transition: fill 0.4s ease-in-out;
	}

	/* Underside of the large shade: distinctly darker, cold shadow */
	.ph5-shade-inner {
		fill: #b8bfcc;
		transition: fill 0.4s ease-in-out;
	}

	.ph5-cable {
		fill: #888;
	}

	/* Bars slightly darker than shade so they read in front */
	.ph5-bars {
		fill: #d8dce8;
		transition: fill 0.4s ease-in-out;
	}

	/* ── Dark mode / lit state ─────────────────────────────────── */

	/* PH5 projects mostly downward, so bias glow slightly that way */
	.lit .ph5-lamp-body {
		filter: drop-shadow(0 0 12px rgba(255, 214, 133, 0.4))
			drop-shadow(0 22px 38px rgba(255, 200, 110, 0.32))
			drop-shadow(0 0 70px rgba(255, 185, 80, 0.18))
			drop-shadow(0 35px 110px rgba(255, 175, 65, 0.1));
	}

	.lit .ph5-shade {
		fill: #fff9ec;
	}

	/* Inner shade warmer and significantly darker — amber shadow */
	.lit .ph5-shade-inner {
		fill: #c0a86a;
	}

	.lit .ph5-cable {
		fill: #888;
	}

	/* Bars slightly darker warm so they contrast against the lit shades */
	.lit .ph5-bars {
		fill: #c8ae80;
	}
</style>
