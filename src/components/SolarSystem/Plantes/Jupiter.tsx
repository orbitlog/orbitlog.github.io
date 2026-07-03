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

export default function Jupiter({ returnTargetId, onReturnComplete }: PlanetProps) {
  const jupiterRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI * 1.5);
  const handleClick = usePlanetInteraction('jupiter', jupiterRef, 5, returnTargetId, onReturnComplete);
  const jupiterTexture = usePlanetTexture(PLANET_TEXTURES.jupiter);

  useFrame((_, delta) => {
    angle.current += delta * 0.08;
    const a = 22;
    const b = 21.8;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (jupiterRef.current) {
      jupiterRef.current.position.set(x, 0, z);
      jupiterRef.current.rotation.y += delta * 1.2;
    }
  });

  const inclination = THREE.MathUtils.degToRad(1.3);

  return (
    <group rotation-x={inclination}>
      <mesh ref={jupiterRef} onClick={handleClick}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshStandardMaterial map={jupiterTexture} roughness={0.5} />
      </mesh>
      <OrbitEllipse a={22} b={21.8} color="white" />
    </group>
  );
}
