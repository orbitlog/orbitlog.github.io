import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { usePlanetInteraction } from './usePlanetInteraction';
import { PLANET_TEXTURES, usePlanetTexture } from './textures';

interface SunProps {
  returnTargetId?: string;
  onReturnComplete?: () => void;
}

export default function Sun({ returnTargetId, onReturnComplete }: SunProps) {
  const sunRef = useRef<THREE.Mesh>(null);
  const coronaRef = useRef<THREE.Mesh>(null);
  const flareOneRef = useRef<THREE.Sprite>(null);
  const flareTwoRef = useRef<THREE.Sprite>(null);
  const flareThreeRef = useRef<THREE.Sprite>(null);
  const handleClick = usePlanetInteraction('sun', sunRef, 8, returnTargetId, onReturnComplete);
  const sunTexture = usePlanetTexture(PLANET_TEXTURES.sun);

  const flareTexture = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 256;
    const context = canvas.getContext('2d');

    if (context) {
      const gradient = context.createRadialGradient(128, 128, 8, 128, 128, 122);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.18, 'rgba(255, 232, 120, 0.92)');
      gradient.addColorStop(0.46, 'rgba(255, 112, 18, 0.55)');
      gradient.addColorStop(1, 'rgba(255, 90, 0, 0)');
      context.fillStyle = gradient;
      context.fillRect(0, 0, 256, 256);
    }

    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

  useFrame((_, delta) => {
    if (sunRef.current) {
      sunRef.current.rotation.y += delta * 0.08;
    }

    if (coronaRef.current) {
      const pulse = 1 + Math.sin(Date.now() * 0.0022) * 0.035;
      coronaRef.current.scale.setScalar(pulse);
      coronaRef.current.rotation.z += delta * 0.08;
    }

    const flarePulse = 1 + Math.sin(Date.now() * 0.003) * 0.12;

    if (flareOneRef.current) {
      flareOneRef.current.scale.set(3.5 * flarePulse, 1.2 * flarePulse, 1);
    }

    if (flareTwoRef.current) {
      flareTwoRef.current.scale.set(2.6 / flarePulse, 0.9 / flarePulse, 1);
    }

    if (flareThreeRef.current) {
      flareThreeRef.current.scale.set(2.1 * flarePulse, 0.75 * flarePulse, 1);
    }
  });

  return (
    <group>
      <mesh ref={sunRef} onClick={handleClick}>
        <sphereGeometry args={[3, 64, 64]} />
        <meshBasicMaterial map={sunTexture} color="#fff2b0" />
      </mesh>
      <mesh ref={coronaRef} onClick={handleClick}>
        <sphereGeometry args={[3.26, 64, 64]} />
        <meshBasicMaterial
          color="#ff8a1f"
          transparent
          opacity={0.18}
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
          depthWrite={false}
        />
      </mesh>
      <sprite ref={flareOneRef} position={[3.15, 0.85, 0]} scale={[3.5, 1.2, 1]} onClick={handleClick}>
        <spriteMaterial map={flareTexture} color="#ffb347" transparent opacity={0.62} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite ref={flareTwoRef} position={[-2.7, -1.25, 0]} scale={[2.6, 0.9, 1]} onClick={handleClick}>
        <spriteMaterial map={flareTexture} color="#ff7a1a" transparent opacity={0.48} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <sprite ref={flareThreeRef} position={[0.6, 3.05, 0]} scale={[2.1, 0.75, 1]} onClick={handleClick}>
        <spriteMaterial map={flareTexture} color="#ffe078" transparent opacity={0.42} blending={THREE.AdditiveBlending} depthWrite={false} />
      </sprite>
      <pointLight intensity={8} distance={320} decay={1.05} color="#FFF0C2" />
    </group>
  );
}
