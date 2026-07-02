import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Neptune() {
  const neptuneRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI * 1.3);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

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

  const handleClick = () => {
    if (neptuneRef.current) {
      focusOn(neptuneRef.current, 8);
      setSelectedPlanet(PLANET_DATA.neptune);
    }
  };

  return (
    <group rotation-x={inclination}>
      <mesh ref={neptuneRef} onClick={handleClick}>
        <sphereGeometry args={[3.88, 32, 32]} />
        <meshStandardMaterial color="#4169E1" roughness={0.4} />
      </mesh>
      <OrbitEllipse a={70} b={69.8} color="white" />
    </group>
  );
}
