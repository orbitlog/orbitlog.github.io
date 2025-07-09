import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import OrbitEllipse from '../OrbitEllipse';
import * as THREE from 'three';

export default function Earth() {
  const earthRef = useRef<THREE.Mesh>(null);
  const angle = useRef(0);

  useFrame((_, delta) => {
    angle.current += delta * 0.3; // 地球公转速度，调慢点
    const a = 15; // 轨道长半轴
    const b = 14; // 短半轴，略微椭圆
    const x = a * Math.cos(angle.current);
    const z = b * Math.sin(angle.current);
    if (earthRef.current) {
      earthRef.current.position.set(x, 0, z);
    }
  });

  const inclination = THREE.MathUtils.degToRad(0); // 地球轨道接近0度

  return (
    <>
        <group rotation-x={inclination}>
            {/* 地球本体 */}
            <mesh ref={earthRef}>
              <sphereGeometry args={[0.6, 32, 32]} />
              <meshStandardMaterial color="blue" />
            </mesh>

            {/* 地球轨道 */}
            <OrbitEllipse a={15} b={14} color="white" />
        </group>
    </>
  );
}
