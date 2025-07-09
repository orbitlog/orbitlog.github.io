import { useThree, useFrame } from '@react-three/fiber';
import { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';

export default function CameraController() {
  const { camera, gl } = useThree();
  const target = new THREE.Vector3(0, 0, 0);

  const [isDragging, setDragging] = useState(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const spherical = useRef(new THREE.Spherical(20, Math.PI / 4, 0)); // radius, phi, theta

  const speed = 0.005;

  const handleMouseDown = (e: MouseEvent) => {
    setDragging(true);
    lastPos.current = { x: e.clientX, y: e.clientY };
    gl.domElement.style.cursor = 'grabbing';
  };

  const handleMouseUp = () => {
    setDragging(false);
    gl.domElement.style.cursor = 'grab';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;

    spherical.current.theta -= deltaX * speed;
    spherical.current.phi -= deltaY * speed;

    // 限制上下角度（避免翻转）
    const EPS = 0.001;
    spherical.current.phi = Math.max(EPS, Math.min(Math.PI - EPS, spherical.current.phi));

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleWheel = (e: WheelEvent) => {
    // 缩放：调整 radius
    const delta = e.deltaY * 0.01;
    spherical.current.radius += delta;
    spherical.current.radius = Math.max(5, Math.min(200, spherical.current.radius));
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
    };
  }, [gl, isDragging]);

  // 每帧根据 spherical 设置相机位置
  useFrame(() => {
    const { radius, phi, theta } = spherical.current;
    const x = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    const z = radius * Math.sin(phi) * Math.cos(theta);

    camera.position.set(x, y, z);
    camera.lookAt(target);
  });

  return null;
}
