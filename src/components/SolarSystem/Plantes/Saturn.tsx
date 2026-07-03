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

export default function Saturn({ returnTargetId, onReturnComplete }: PlanetProps) {
  const saturnRef = useRef<THREE.Group>(null);
  const angle = useRef(0);
  const handleClick = usePlanetInteraction('saturn', saturnRef, 6, returnTargetId, onReturnComplete);
  const saturnTexture = usePlanetTexture(PLANET_TEXTURES.saturn);
  const ringTexture = usePlanetTexture(PLANET_TEXTURES.saturnRing);

  useFrame((_, delta) => {
    angle.current += delta * 0.034;
    const a = 28;
    const b = 27.8;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (saturnRef.current) {
      saturnRef.current.position.set(x, 0, z);
      saturnRef.current.rotation.y += delta * 1.1;
    }
  });

  const inclination = THREE.MathUtils.degToRad(2.5);

  return (
    <group rotation-x={inclination}>
      <group ref={saturnRef} onClick={handleClick}>
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial map={saturnTexture} roughness={0.5} />
        </mesh>
        <mesh rotation-x={Math.PI / 2.2}>
          <ringGeometry args={[1.8, 2.5, 64]} />
          <meshStandardMaterial
            map={ringTexture}
            alphaMap={ringTexture}
            side={THREE.DoubleSide}
            opacity={0.92}
            transparent
            roughness={0.6}
            depthWrite={false}
          />
        </mesh>
      </group>
      <OrbitEllipse a={28} b={27.8} color="white" />
    </group>
  );
}
