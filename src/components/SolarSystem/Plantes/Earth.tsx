import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

  useFrame((_, delta) => {
    angle.current += delta * 0.3;
    const a = 14;
    const b = 13.9;
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (earthRef.current) {
      earthRef.current.position.set(x, 0, z);
      earthRef.current.rotation.y += delta * 0.5;
    }
  });

  const inclination = THREE.MathUtils.degToRad(0);

  const handleClick = () => {
    if (earthRef.current) {
      focusOn(earthRef.current, 3);
      setSelectedPlanet(PLANET_DATA.earth);
    }
  };

  return (
    <group rotation-x={inclination}>
      <mesh ref={earthRef} onClick={handleClick}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#1E90FF" roughness={0.6} metalness={0.2} />
      </mesh>
      <OrbitEllipse a={14} b={13.9} color="white" />
    </group>
  );
}
