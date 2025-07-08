import { useRef, useEffect, useState } from 'react';
import { useLoader, useThree } from '@react-three/fiber';
import * as THREE from 'three';

export default function RotatingSky() {
  const skyRef = useRef<THREE.Mesh>(null);
  const { gl } = useThree();
  const [isDragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });

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

  // 鼠标按下
  const handleMouseDown = (e: MouseEvent) => {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    gl.domElement.style.cursor = 'grabbing';
  };

  // 鼠标松开
  const handleMouseUp = () => {
    setDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  // 鼠标移动
  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging && skyRef.current) {
      const deltaX = e.clientX - lastPos.current.x;
      const deltaY = e.clientY - lastPos.current.y;

      // 更新 rotation，允许无限旋转
      skyRef.current.rotation.y += deltaX * 0.002;
      skyRef.current.rotation.x -= deltaY * 0.002;

      lastPos.current = { x: e.clientX, y: e.clientY };
    }
  };

  // 挂载和清理事件
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';

    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      canvas.style.cursor = 'none';
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [gl, isDragging]);

  return (
    <mesh ref={skyRef} material={materials}>
      <boxGeometry args={[500, 500, 500]} />
    </mesh>
  );
}
