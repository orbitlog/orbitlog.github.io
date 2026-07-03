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

export default function Uranus({ returnTargetId, onReturnComplete }: PlanetProps) {
  const uranusRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI * 0.7);
  const handleClick = usePlanetInteraction('uranus', uranusRef, 8, returnTargetId, onReturnComplete);
  const uranusTexture = usePlanetTexture(PLANET_TEXTURES.uranus);

  useFrame((_, delta) => {
    angle.current += delta * 0.0036;
    const a = 56;
    const b = 55.8;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (uranusRef.current) {
      uranusRef.current.position.set(x, 0, z);
      uranusRef.current.rotation.y -= delta * 0.7;
    }
  });

  const inclination = THREE.MathUtils.degToRad(0.77);

  return (
    <group rotation-x={inclination}>
      <mesh ref={uranusRef} onClick={handleClick}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial map={uranusTexture} roughness={0.4} />
      </mesh>
      <OrbitEllipse a={56} b={55.8} color="white" />
    </group>
  );
}
