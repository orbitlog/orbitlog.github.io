import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Venus() {
  const venusRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI * 0.5);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

  useFrame((_, delta) => {
    angle.current += delta * 0.32;
    const a = 11;
    const b = 10.9;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (venusRef.current) {
      venusRef.current.position.set(x, 0, z);
      venusRef.current.rotation.y -= delta * 0.05;
    }
  });

  const inclination = THREE.MathUtils.degToRad(3.4);

  const handleClick = () => {
    if (venusRef.current) {
      focusOn(venusRef.current, 3);
      setSelectedPlanet(PLANET_DATA.venus);
    }
  };

  return (
    <group rotation-x={inclination}>
      <mesh ref={venusRef} onClick={handleClick}>
        <sphereGeometry args={[0.95, 32, 32]} />
        <meshStandardMaterial color="#FFC649" roughness={0.7} />
      </mesh>
      <OrbitEllipse a={11} b={10.9} color="white" />
    </group>
  );
}
