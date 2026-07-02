import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Mars() {
  const marsRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

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

  const handleClick = () => {
    if (marsRef.current) {
      focusOn(marsRef.current, 3);
      setSelectedPlanet(PLANET_DATA.mars);
    }
  };

  return (
    <group rotation-x={inclination}>
      <mesh ref={marsRef} onClick={handleClick}>
        <sphereGeometry args={[0.53, 32, 32]} />
        <meshStandardMaterial color="#CD5C5C" roughness={0.8} />
      </mesh>
      <OrbitEllipse a={17} b={16.8} color="white" />
    </group>
  );
}
