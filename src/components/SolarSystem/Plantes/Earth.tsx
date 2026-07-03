import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { usePlanetInteraction } from '../usePlanetInteraction';
import { PLANET_TEXTURES, usePlanetTexture } from '../textures';

interface PlanetProps {
  returnTargetId?: string;
  onReturnComplete?: () => void;
}

export default function Earth({ returnTargetId, onReturnComplete }: PlanetProps) {
  const earthRef = useRef<THREE.Mesh>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  const handleClick = usePlanetInteraction('earth', earthRef, 3, returnTargetId, onReturnComplete);
  const earthTexture = usePlanetTexture(PLANET_TEXTURES.earth);
  const cloudTexture = usePlanetTexture(PLANET_TEXTURES.earthClouds);

  useFrame((_, delta) => {
    angle.current += delta * 0.3;
    const a = 14;
    const b = 13.9;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (earthRef.current) {
      earthRef.current.position.set(x, 0, z);
      earthRef.current.rotation.y += delta * 0.5;
    }

    if (cloudsRef.current) {
      cloudsRef.current.position.set(x, 0, z);
      cloudsRef.current.rotation.y += delta * 0.62;
    }
  });

  const inclination = THREE.MathUtils.degToRad(0);

  return (
    <group rotation-x={inclination}>
      <mesh ref={earthRef} onClick={handleClick}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial map={earthTexture} roughness={0.6} metalness={0.08} />
      </mesh>
      <mesh ref={cloudsRef} onClick={handleClick}>
        <sphereGeometry args={[1.025, 32, 32]} />
        <meshStandardMaterial
          alphaMap={cloudTexture}
          color="#ffffff"
          transparent
          opacity={0.38}
          depthWrite={false}
        />
      </mesh>
      <OrbitEllipse a={14} b={13.9} color="white" />
    </group>
  );
}
