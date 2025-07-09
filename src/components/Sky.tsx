import { useRef } from 'react';
import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function RotatingSky() {
  const skyRef = useRef<THREE.Mesh>(null);

  // 加载 6 面贴图
  const textures = useLoader(THREE.TextureLoader, [
    '/textures/mobile_r.jpg', // 右
    '/textures/mobile_l.jpg', // 左
    '/textures/mobile_u.jpg', // 上
    '/textures/mobile_d.jpg', // 下
    '/textures/mobile_f.jpg', // 前
    '/textures/mobile_b.jpg', // 后
  ]);

  const materials = textures.map(
    (texture) =>
      new THREE.MeshBasicMaterial({
        map: texture,
        side: THREE.BackSide,
        depthWrite: false,
      })
  );

  return (
    <mesh ref={skyRef} material={materials}>
      <boxGeometry args={[500, 500, 500]} />
    </mesh>
  );
}
