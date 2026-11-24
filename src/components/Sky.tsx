import { useLoader } from '@react-three/fiber';
import * as THREE from 'three';

export default function RotatingSky() {
  // 加载 6 面贴图
  const textures = useLoader(THREE.TextureLoader, [
    '/textures/mobile_r.webp', // 右
    '/textures/mobile_l.webp', // 左
    '/textures/mobile_u.webp', // 上
    '/textures/mobile_d.webp', // 下
    '/textures/mobile_f.webp', // 前
    '/textures/mobile_b.webp', // 后
  ]);

  return (
    <mesh>
      <boxGeometry args={[500, 500, 500]} />
      {textures.map((texture, index) => (
        <meshBasicMaterial
          key={texture.uuid}
          attach={`material-${index}`}
          map={texture}
          color="#7b8799"
          side={THREE.BackSide}
          depthWrite={false}
        />
      ))}
    </mesh>
  );
}
