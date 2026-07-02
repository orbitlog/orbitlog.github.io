import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Mercury() {
  const mercuryRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

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

  const handleClick = () => {
    if (mercuryRef.current) {
      focusOn(mercuryRef.current, 3);
      setSelectedPlanet(PLANET_DATA.mercury);
    }
  };

  return (
    <group rotation-x={inclination}>
      <mesh ref={mercuryRef} onClick={handleClick}>
        <sphereGeometry args={[0.38, 32, 32]} />
        <meshStandardMaterial color="#8C7853" roughness={0.9} />
      </mesh>
      <OrbitEllipse a={8} b={7.8} color="white" />
    </group>
  );
}
