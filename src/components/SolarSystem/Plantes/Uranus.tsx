import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Uranus() {
  const uranusRef = useRef<THREE.Mesh>(null);
  const angle = useRef(Math.PI * 0.7);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

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

  const handleClick = () => {
    if (uranusRef.current) {
      focusOn(uranusRef.current, 8);
      setSelectedPlanet(PLANET_DATA.uranus);
    }
  };

  return (
    <group rotation-x={inclination}>
      <mesh ref={uranusRef} onClick={handleClick}>
        <sphereGeometry args={[4, 32, 32]} />
        <meshStandardMaterial color="#4FD0E7" roughness={0.4} />
      </mesh>
      <OrbitEllipse a={56} b={55.8} color="white" />
    </group>
  );
}
