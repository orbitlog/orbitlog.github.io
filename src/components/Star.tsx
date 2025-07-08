import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export default function RotatingStar() {
  const starRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (starRef.current) {
      starRef.current.rotation.y += 0.005;
    }
  });

  return (
    <mesh ref={starRef}>
      <sphereGeometry args={[2.5, 64, 64]} />
      <meshStandardMaterial
        color="#ffaa33"
        emissive="#ffaa33"
        emissiveIntensity={2}
      />
    </mesh>
  );
}
