import {
  useThree,
  useFrame
} from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { CameraContext } from '@/contexts/CameraContext';

export default function CameraController({ children }: { children: React.ReactNode }) {
  const { camera, gl } = useThree();

  const spherical = useRef(new THREE.Spherical(40, Math.PI / 3, Math.PI / 4));
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const lastPos = useRef({ x: 0, y: 0 });
  const movement = useRef({
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  });
  const focusTarget = useRef<THREE.Object3D | null>(null);
  const focusDistance = useRef(5);
  const isFollowing = useRef(false);
  // 使用useRef防止闭包导致的state不改变问题
  const isDragging = useRef(false);

  const speed = 0.005;
  const moveSpeed = 0.5;

  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY };
    gl.domElement.style.cursor = 'grabbing';
    focusTarget.current = null;
    isFollowing.current = false;
  };

  const handleMouseUp = () => {
    isDragging.current = false
    gl.domElement.style.cursor = 'grab';
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.current) return;
    const deltaX = e.clientX - lastPos.current.x;
    const deltaY = e.clientY - lastPos.current.y;

    const offset = new THREE.Vector3().subVectors(camera.position, target.current);
    const sphericalOffset = new THREE.Spherical().setFromVector3(offset);
    sphericalOffset.theta -= deltaX * speed;
    sphericalOffset.phi -= deltaY * speed;

    const EPS = 0.001;
    sphericalOffset.phi = Math.max(EPS, Math.min(Math.PI - EPS, sphericalOffset.phi));

    offset.setFromSpherical(sphericalOffset);
    camera.position.copy(target.current.clone().add(offset));
    camera.lookAt(target.current);

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  const handleWheel = (e: WheelEvent) => {
    const dir = new THREE.Vector3().subVectors(camera.position, target.current).normalize();
    const distance = camera.position.distanceTo(target.current);
    let newDistance = distance + e.deltaY * 0.01;
    newDistance = Math.max(5, Math.min(200, newDistance));
    camera.position.copy(target.current.clone().add(dir.multiplyScalar(newDistance)));
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'w') movement.current.forward = true;
    if (e.key === 's') movement.current.backward = true;
    if (e.key === 'a') movement.current.left = true;
    if (e.key === 'd') movement.current.right = true;
    if (e.key === 'q') movement.current.down = true;
    if (e.key === 'e') movement.current.up = true;
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (e.key === 'w') movement.current.forward = false;
    if (e.key === 's') movement.current.backward = false;
    if (e.key === 'a') movement.current.left = false;
    if (e.key === 'd') movement.current.right = false;
    if (e.key === 'q') movement.current.down = false;
    if (e.key === 'e') movement.current.up = false;
  };

  useEffect(() => {
    const canvas = gl.domElement;
    canvas.style.cursor = 'grab';

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('wheel', handleWheel);
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('wheel', handleWheel);
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gl]);

  const focusOn = (targetObj: THREE.Object3D, distance = 5) => {
    const targetPos = new THREE.Vector3();
    targetObj.getWorldPosition(targetPos);

    const direction = new THREE.Vector3()
      .subVectors(camera.position, targetPos)
      .normalize();

    const newPos = targetPos.clone().add(direction.multiplyScalar(distance));

    gsap.to(camera.position, {
      x: newPos.x,
      y: newPos.y,
      z: newPos.z,
      duration: 1.5,
      ease: 'power2.out',
      onUpdate: () => {
        camera.lookAt(targetPos);
      },
      onComplete: () => {
        focusTarget.current = targetObj;
        focusDistance.current = distance;
        isFollowing.current = true;
      },
    });
  };

  useFrame(() => {
    // 若已聚焦某个目标，进入跟随模式
    if (focusTarget.current && isFollowing.current) {
      const targetPos = new THREE.Vector3();
      focusTarget.current.getWorldPosition(targetPos);

      const direction = new THREE.Vector3()
        .subVectors(camera.position, targetPos)
        .normalize();

      const desiredPos = targetPos.clone().add(direction.multiplyScalar(focusDistance.current));
      camera.position.lerp(desiredPos, 0.1);
      camera.lookAt(targetPos);
      return;
    }

    // 同步 spherical 状态（以 target 为中心）
    const offset = new THREE.Vector3().subVectors(camera.position, target.current);
    spherical.current.setFromVector3(offset);

    const moveDir = new THREE.Vector3();
    const forward = new THREE.Vector3();
    camera.getWorldDirection(forward);
    forward.normalize();

    const right = new THREE.Vector3().crossVectors(forward, camera.up).normalize();

    if (movement.current.forward) moveDir.add(forward);
    if (movement.current.backward) moveDir.sub(forward);
    if (movement.current.left) moveDir.sub(right);
    if (movement.current.right) moveDir.add(right);
    if (movement.current.up) moveDir.add(camera.up);
    if (movement.current.down) moveDir.sub(camera.up);

    moveDir.multiplyScalar(moveSpeed);
    camera.position.add(moveDir);
    target.current.add(moveDir);

    camera.lookAt(target.current);
  });

  return (
    <CameraContext.Provider value={{ focusOn }}>
      {children}
    </CameraContext.Provider>
  );
}
