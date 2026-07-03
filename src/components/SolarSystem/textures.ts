import { useEffect } from 'react';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

export const PLANET_TEXTURES = {
  sun: '/textures/planets/sun.jpg',
  mercury: '/textures/planets/mercury.jpg',
  venus: '/textures/planets/venus.jpg',
  earth: '/textures/planets/earth.jpg',
  earthClouds: '/textures/planets/earth_clouds.jpg',
  mars: '/textures/planets/mars.jpg',
  jupiter: '/textures/planets/jupiter.jpg',
  saturn: '/textures/planets/saturn.jpg',
  saturnRing: '/textures/planets/saturn_ring.png',
  uranus: '/textures/planets/uranus.jpg',
  neptune: '/textures/planets/neptune.jpg',
} as const;

export function usePlanetTexture(path: string) {
  const texture = useTexture(path);

  useEffect(() => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.anisotropy = 8;
    texture.needsUpdate = true;
  }, [texture]);

  return texture;
}
