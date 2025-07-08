import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Suspense, useRef, useState } from 'react';
import * as THREE from 'three';

import Star from '@/components/Star';
// import Skybox from '@/components/Skybox';
import Planet from '@/components/Planet';
import InfoCard from '@/components/InfoCard';

const planetData = [
  { name: 'Blog', position: [5, 0, 0], description: 'My thoughts and writings' },
  { name: 'Projects', position: [0, 5, 0], description: 'A list of my creations' },
  { name: 'About', position: [-5, 0, 0], description: 'Who am I?' },
];

export default function SolarSystem() {
  const [selectedPlanet, setSelectedPlanet] = useState<{
    name: string;
    description: string;
    position: [number, number, number];
  } | null>(null);

  const controlsRef = useRef<any>(null);
  const cameraTarget = useRef(new THREE.Vector3());

  function CameraUpdater({ controlsRef, target }: {
    controlsRef: any;
    target: THREE.Vector3;
  }) {
    useFrame(() => {
      controlsRef.current?.target.lerp(target, 0.05);
      controlsRef.current?.update();
    });
    return null;
  }

  const handlePlanetClick = (name: string, position: [number, number, number]) => {
    const planet = planetData.find(p => p.name === name);
    if (planet) {
      setSelectedPlanet({ ...planet, position });
      cameraTarget.current.set(...position);
    }
  };

  return (
    <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <Canvas shadows camera={{ position: [0, 0, 20], fov: 60 }}>
        <Suspense fallback={null}>
          {/* <Skybox /> */}
          <Star />
          {planetData.map(planet => (
            <Planet
              key={planet.name}
              name={planet.name}
              position={planet.position}
              onClick={handlePlanetClick}
            />
          ))}
          <ambientLight intensity={0.1} />
        </Suspense>
        <OrbitControls
          ref={controlsRef}
          enableZoom
          enablePan={false}
          maxDistance={40}
          minDistance={5}
        />
        <CameraUpdater controlsRef={controlsRef} target={cameraTarget.current} />
      </Canvas>

      {selectedPlanet && (
        <InfoCard
          title={selectedPlanet.name}
          description={selectedPlanet.description}
          onClose={() => setSelectedPlanet(null)}
          onEnter={() => {
            window.location.href = `/${selectedPlanet.name.toLowerCase()}`;
          }}
        />
      )}
    </div>
  );
}
