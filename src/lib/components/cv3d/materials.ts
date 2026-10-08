import * as THREE from 'three';

export const chromeMat = new THREE.MeshStandardMaterial({
	color: 0xf2f2f2,
	metalness: 1,
	roughness: 0.14
});

// Powder-coated steel: a slightly glossy painted surface
export function paintMat(color: string) {
	return new THREE.MeshPhysicalMaterial({
		color,
		metalness: 0,
		roughness: 0.42,
		clearcoat: 0.35,
		clearcoatRoughness: 0.4
	});
}

export const BODY_COLOR = '#e8e7e2'; // USM pure white
