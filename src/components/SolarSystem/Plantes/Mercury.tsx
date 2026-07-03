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

export default function Mercury({ returnTargetId, onReturnComplete }: PlanetProps) {
  const mercuryRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  const handleClick = usePlanetInteraction('mercury', mercuryRef, 3, returnTargetId, onReturnComplete);
  const mercuryTexture = usePlanetTexture(PLANET_TEXTURES.mercury);

  useFrame((_, delta) => {
    angle.current += delta * 0.4;
    const a = 8;
    const b = 7.8;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (mercuryRef.current) {
      mercuryRef.current.position.set(x, 0, z);
      mercuryRef.current.rotation.y += delta * 0.1;
    }
  });

  const inclination = THREE.MathUtils.degToRad(7);

  return (
    <group rotation-x={inclination}>
      <mesh ref={mercuryRef} onClick={handleClick}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial map={mercuryTexture} roughness={0.9} />
      </mesh>
      <OrbitEllipse a={8} b={7.8} color="white" />
    </group>
  );
}
