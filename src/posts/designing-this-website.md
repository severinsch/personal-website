---
title: Designing this website
date: '2026-04-10'
description: A few notes on the mid-century look, the lamps in the corners, and the 3D shelf on the CV page.
---

I wanted this site to feel like a room rather than a landing page. Most personal sites I like have some kind of character to them, and I figured I'd lean into something I actually enjoy looking at: nice interiors. Warm woods, nice colors, a bit of texture. Nothing flashy.

## Colors and type

The palette is built around cream and linen for backgrounds, walnut and espresso for text, with mustard, teal, rust, olive, and clay as accents. In dark mode everything shifts to a deep walnut-brown with warm cream text. I specifically didn't want cold grays or pure black. It should feel like a lamp-lit room in the evening, not a terminal.

Headings are set in Plus Jakarta Sans, body copy in Satoshi, code in JetBrains Mono. There's a subtle grain overlay across the whole page (an SVG turbulence filter at very low opacity) to take the edge off the flat CSS colors. Small starburst dividers and diamond accents show up here and there as a nod to the era.

## The lamps

The two things I like most are the lamps in the corners. Besides looking good, they can also be used to toggle the dark mode. Click either one and the room turns on or off.

The one on the left is an [Akari 1A](https://www.vitra.com/de-de/product/details/akari-1a) by Isamu Noguchi, a floor lamp made of washi paper and bamboo ribbing, originally designed in the 1950s. The one on the right is a [PH 5](https://www.louispoulsen.com/en-eu/private/catalog/indoor/pendants/ph-5) pendant by Poul Henningsen for Louis Poulsen, the layered metal shade that's been hanging in Danish kitchens since 1958. I wanted two lamps that felt like they belonged in the same imaginary room but came from different corners of design.

Both lamps are hand-traced SVGs. I pulled reference photos into Figma and traced them layer by layer: the paper body, the bamboo wire pattern, the feet and cord for the Akari; the stacked shades, and the little suspension cable for the PH 5. The wire pattern on the Akari was by far the most tedious part; it's a single path with a lot of little strokes that suggest the bamboo without actually drawing each rib.

Each SVG is split into layers that I can style independently in CSS, which is how the "on" state works. The shade gets a warm glow, the surrounding area lights up slightly, and the wire pattern gets a bit more contrast. There's also a tiny click sound, which I think is the part that makes it feel like a physical switch rather than a button.

## The 3D shelf

The [CV page](/cv) has a link in the corner to an [interactive 3D version](/cv3d). It's a [USM Haller](https://www.usm.com/de-ch/kollektionen/usm-haller-system/usm-haller) shelf, a modular metal system with chrome ball connectors and colored panels most people saw somewhere already at some point, where each compartment is a section of my CV. Clicking a door opens it and reveals the content inside.

A USM Haller shelf is one of those pieces I'd love to own but currently cannot justify buying, so putting one on my website was the next best thing. The grid of compartments also happens to map pretty naturally onto CV sections: education, work, projects. Each column is a category, each row is an entry.

It's built with [Threlte](https://threlte.xyz/), which is a Svelte wrapper around Three.js. The frame is a bunch of instanced boxes and cylinders for the ball joints, the doors are hinged planes that rotate on click, and the content inside each door is rendered as 3D text using a Plus Jakarta Sans font atlas. Lighting is just a few directional lights positioned to pick up the colored top plates of the shelf.

I'm not super satisfied with how it looks, but currently can't really justify tinkering even more on this.

Also, it's probably a little gimmicky for a CV anyway. But it was fun to build, and the static HTML version is still there for anyone who'd rather just read the thing.

## Stack

For the curious: this is SvelteKit with Svelte 5, Tailwind v4, mdsvex for these blog posts, and bun. Nothing fancy. The 'fanciest' part is the shelf, even if it does not look like it.

Claude code helped with some things, mostly technical stuff, but was less helpful for others like design and taste.

That's most of it. If you spotted something broken, want to know where a specific detail came from, or know other fun ways to integrate interior design into websites, feel free to reach out.
