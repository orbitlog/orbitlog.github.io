import { useRef } from 'react';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export default function Sun() {
  const sunRef = useRef(null);
  const { focusOn } = useCamera();
  const { setSelectedPlanet } = usePlanet();

  const handleClick = () => {
    if (sunRef.current) {
      focusOn(sunRef.current, 8);
      setSelectedPlanet(PLANET_DATA.sun);
    }
  };

  return (
    <mesh ref={sunRef} onClick={handleClick}>
      <sphereGeometry args={[3, 64, 64]} />
      <meshStandardMaterial color="#FDB813" emissive="#FDB813" emissiveIntensity={1.5} />
      <pointLight intensity={2} distance={100} decay={2} />
    </mesh>
  );
}
