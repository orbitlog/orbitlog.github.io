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

export default function Mars({ returnTargetId, onReturnComplete }: PlanetProps) {
  const marsRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI);
  const handleClick = usePlanetInteraction('mars', marsRef, 3, returnTargetId, onReturnComplete);
  const marsTexture = usePlanetTexture(PLANET_TEXTURES.mars);

  useFrame((_, delta) => {
    angle.current += delta * 0.16;
    const a = 17;
    const b = 16.8;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (marsRef.current) {
      marsRef.current.position.set(x, 0, z);
      marsRef.current.rotation.y += delta * 0.48;
    }
  });

  const inclination = THREE.MathUtils.degToRad(1.85);

  return (
    <group rotation-x={inclination}>
      <mesh ref={marsRef} onClick={handleClick}>
        <sphereGeometry args={[0.53, 32, 32]} />
        <meshStandardMaterial map={marsTexture} roughness={0.8} />
      </mesh>
      <OrbitEllipse a={17} b={16.8} color="white" />
    </group>
  );
}
