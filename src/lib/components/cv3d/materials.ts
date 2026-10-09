import * as THREE from 'three';
import { lowPower } from './state.svelte';

export const chromeMat = new THREE.MeshStandardMaterial({
	color: 0xf2f2f2,
	metalness: 1,
	roughness: 0.14
});

// Powder-coated steel: a slightly glossy painted surface. Phones get the plain standard material:
// the clearcoat variant is a much bigger shader, and some mobile drivers choke compiling it.
export function paintMat(color: string) {
	if (lowPower) return new THREE.MeshStandardMaterial({ color, roughness: 0.42 });
	return new THREE.MeshPhysicalMaterial({
		color,
		metalness: 0,
		roughness: 0.42,
		clearcoat: 0.35,
		clearcoatRoughness: 0.4
	});
}

export const BODY_COLOR = '#e8e7e2'; // USM pure white
