import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Jupiter() {
  const jupiterRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI * 1.5);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

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

  const handleClick = () => {
    if (jupiterRef.current) {
      focusOn(jupiterRef.current, 5);
      setSelectedPlanet(PLANET_DATA.jupiter);
    }
  };

  return (
    <group rotation-x={inclination}>
      <mesh ref={jupiterRef} onClick={handleClick}>
        <sphereGeometry args={[1.4, 64, 64]} />
        <meshStandardMaterial color="#C88B3A" roughness={0.5} />
      </mesh>
      <OrbitEllipse a={22} b={21.8} color="white" />
    </group>
  );
}
