import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';

export default function Mercury() {
  const mercuryRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);
  const { focusOn } = useCamera();

  useFrame((_, delta) => {
    angle.current += delta * 0.2; // 公转速度
    const a = 10; // 长半轴
    const b = 9.5; // 短半轴
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (mercuryRef.current) {
      mercuryRef.current.position.set(x, 0, z);
    }
  });

  const inclination = THREE.MathUtils.degToRad(7); // 地球轨道接近0度

  return (
    <>
        <group rotation-x={inclination}>
            {/* 水星本体 */}
            <mesh 
              ref={mercuryRef} 
              onClick={() => {
                if (mercuryRef.current) focusOn(mercuryRef.current, 10); // 可设距离
              }}
            >
              <sphereGeometry args={[0.4, 32, 32]} />
              <meshStandardMaterial color="blue" />
            </mesh>

            {/* 水星轨道 */}
            <OrbitEllipse a={10} b={9.5} color="white" />
        </group>
    </>
  );
}
