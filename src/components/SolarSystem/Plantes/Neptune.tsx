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

export default function Neptune({ returnTargetId, onReturnComplete }: PlanetProps) {
  const neptuneRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI * 1.3);
  const handleClick = usePlanetInteraction('neptune', neptuneRef, 8, returnTargetId, onReturnComplete);
  const neptuneTexture = usePlanetTexture(PLANET_TEXTURES.neptune);

  useFrame((_, delta) => {
    angle.current += delta * 0.0018;
    const a = 70;
    const b = 69.8;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (neptuneRef.current) {
      neptuneRef.current.position.set(x, 0, z);
      neptuneRef.current.rotation.y += delta * 0.9;
    }
  });

  const inclination = THREE.MathUtils.degToRad(1.77);

  return (
    <group rotation-x={inclination}>
      <mesh ref={neptuneRef} onClick={handleClick}>
        <sphereGeometry args={[3.88, 32, 32]} />
        <meshStandardMaterial map={neptuneTexture} roughness={0.4} />
      </mesh>
      <OrbitEllipse a={70} b={69.8} color="white" />
    </group>
  );
}
