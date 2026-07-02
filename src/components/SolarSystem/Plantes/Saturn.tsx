import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Saturn() {
  const saturnRef = useRef<THREE.Group>(null);
  const angle = useRef(0);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

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

  const handleClick = () => {
    if (saturnRef.current) {
      focusOn(saturnRef.current, 6);
      setSelectedPlanet(PLANET_DATA.saturn);
    }
  };

  return (
    <group rotation-x={inclination}>
      <group ref={saturnRef} onClick={handleClick}>
        <mesh>
          <sphereGeometry args={[1.2, 64, 64]} />
          <meshStandardMaterial color="#F4A460" roughness={0.5} />
        </mesh>
        <mesh rotation-x={Math.PI / 2.2}>
          <ringGeometry args={[1.8, 2.5, 64]} />
          <meshStandardMaterial color="#D2B48C" side={THREE.DoubleSide} opacity={0.8} transparent roughness={0.6} />
        </mesh>
      </group>
      <OrbitEllipse a={28} b={27.8} color="white" />
    </group>
  );
}
