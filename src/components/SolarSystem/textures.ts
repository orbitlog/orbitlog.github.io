import { useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const PLANET_TEXTURES = {
  sun: '/textures/planets/sun.webp',
  mercury: '/textures/planets/mercury.webp',
  venus: '/textures/planets/venus.webp',
  earth: '/textures/planets/earth.webp',
  earthClouds: '/textures/planets/earth_clouds.webp',
  mars: '/textures/planets/mars.webp',
  jupiter: '/textures/planets/jupiter.webp',
  saturn: '/textures/planets/saturn.webp',
  saturnRing: '/textures/planets/saturn_ring.png',
  uranus: '/textures/planets/uranus.webp',
  neptune: '/textures/planets/neptune.webp',
} as const;

// Start all maps together, including the secondary cloud/ring maps, before rendering.
Object.values(PLANET_TEXTURES).forEach((path) => useTexture.preload(path));

export function usePlanetTexture(path: string) {
  const texture = useTexture(path);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return texture;
}
