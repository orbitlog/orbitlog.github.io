import {
  useThree,
  useFrame
} from '@react-three/fiber';
import { useEffect, useLayoutEffect, useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';
import { useCamera } from '@/contexts/CameraContext';

export default function CameraController({ children }: { children: React.ReactNode }) {
  const { camera, gl } = useThree();
  const { registerControls } = useCamera();

  const spherical = useRef(new THREE.Spherical(40, Math.PI / 3, Math.PI / 4));
  const target = useRef(new THREE.Vector3(0, 0, 0));
  const solarSystemTarget = useRef(new THREE.Vector3(0, 0, 0));
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
  const focusOffset = useRef(new THREE.Vector3(0, 0, 5));
  const isFollowing = useRef(false);
  const isAnimating = useRef(false);
  const hasManualOrbit = useRef(false);
  // 使用useRef防止闭包导致的state不改变问题
  const isDragging = useRef(false);

  const speed = 0.005;
  const moveSpeed = 0.5;
  const defaultCameraPosition = useRef(new THREE.Vector3(0, 20, 80));
  const defaultLookAt = useRef(new THREE.Vector3(0, 0, 0));
  const activeTween = useRef<gsap.core.Tween | null>(null);

  const getWorldTarget = (targetObj: THREE.Object3D) => {
    const targetPos = new THREE.Vector3();
    targetObj.getWorldPosition(targetPos);
    return targetPos;
  };

  const getRadialDirection = (targetPos: THREE.Vector3) => {
    const direction = targetPos.clone().sub(solarSystemTarget.current);

    if (direction.lengthSq() < 0.0001) {
      return new THREE.Vector3(0, 0.2, 1).normalize();
    }

    return direction.normalize();
  };

  const getRadialCameraPosition = (targetObj: THREE.Object3D, distance: number) => {
    const targetPos = getWorldTarget(targetObj);
    return {
      cameraPos: targetPos.clone().add(getRadialDirection(targetPos).multiplyScalar(distance)),
      targetPos,
    };
  };

  const getFocusedCameraPosition = (targetObj: THREE.Object3D, distance: number) => {
    const targetPos = getWorldTarget(targetObj);
    const direction = focusOffset.current.lengthSq() > 0.0001
      ? focusOffset.current.clone().normalize()
      : getRadialDirection(targetPos);

    return {
      cameraPos: targetPos.clone().add(direction.multiplyScalar(distance)),
      targetPos,
    };
  };

  const syncFocusOffset = () => {
    focusOffset.current.copy(camera.position).sub(target.current);
    focusDistance.current = focusOffset.current.length();
  };

  const stopActiveTween = () => {
    activeTween.current?.kill();
    activeTween.current = null;
    isAnimating.current = false;
  };

  /**
   * 鼠标按下拖动
   * @param e 
   */
  const handleMouseDown = (e: MouseEvent) => {
    isDragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY };
    gl.domElement.style.cursor = 'grabbing';
  };

  /**
   * 鼠标抬起
   */
  const handleMouseUp = () => {
    isDragging.current = false
    gl.domElement.style.cursor = 'grab';
  };

  /**
   * 鼠标移动
   * @param e 
   * @returns 
   */
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

    if (focusTarget.current) {
      focusOffset.current.copy(offset);
      focusDistance.current = offset.length();
      hasManualOrbit.current = true;
    }

    lastPos.current = { x: e.clientX, y: e.clientY };
  };

  /**
   * 滚轮放大
   * @param e 
   */
  const handleWheel = (e: WheelEvent) => {
    const dir = new THREE.Vector3().subVectors(camera.position, target.current).normalize();
    const distance = camera.position.distanceTo(target.current);
    let newDistance = distance + e.deltaY * 0.01;
    const minDistance = focusTarget.current ? 0.72 : 5;
    newDistance = Math.max(minDistance, Math.min(200, newDistance));
    camera.position.copy(target.current.clone().add(dir.multiplyScalar(newDistance)));

    if (focusTarget.current) {
      focusDistance.current = newDistance;
      focusOffset.current.copy(camera.position).sub(target.current);
    }
  };

  /**
   * 前进后退
   * @param e 
   */
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
    // Camera controls are bound to the current canvas and read mutable refs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl]);

  /**
   * 聚焦星球
   * @param targetObj 
   * @param distance 
   */
  const focusOn = (targetObj: THREE.Object3D, distance = 5) => {
    stopActiveTween();
    isAnimating.current = true;
    isFollowing.current = false;
    hasManualOrbit.current = false;
    focusTarget.current = targetObj;
    focusDistance.current = distance;

    const startCamera = camera.position.clone();
    const progress = { value: 0 };

    return new Promise<void>((resolve) => {
      activeTween.current = gsap.to(progress, {
        value: 1,
        duration: 1.7,
        ease: 'power3.inOut',
        onUpdate: () => {
          const { cameraPos, targetPos } = getRadialCameraPosition(targetObj, distance);
          camera.position.lerpVectors(startCamera, cameraPos, progress.value);
          target.current.copy(targetPos);
          camera.lookAt(targetPos);
        },
        onComplete: () => {
          const { cameraPos, targetPos } = getRadialCameraPosition(targetObj, distance);
          camera.position.copy(cameraPos);
          target.current.copy(targetPos);
          camera.lookAt(targetPos);
          syncFocusOffset();
          isAnimating.current = false;
          isFollowing.current = true;
          activeTween.current = null;
          resolve();
        },
      });
    });
  };

  const resetView = () => {
    stopActiveTween();
    const startCamera = camera.position.clone();
    const startTarget = target.current.clone();
    const progress = { value: 0 };

    focusTarget.current = null;
    isFollowing.current = false;
    hasManualOrbit.current = false;
    isAnimating.current = true;

    return new Promise<void>((resolve) => {
      activeTween.current = gsap.to(progress, {
        value: 1,
        duration: 1.45,
        ease: 'power3.inOut',
        onUpdate: () => {
          camera.position.lerpVectors(startCamera, defaultCameraPosition.current, progress.value);
          target.current.lerpVectors(startTarget, defaultLookAt.current, progress.value);
          camera.lookAt(target.current);
        },
        onComplete: () => {
          camera.position.copy(defaultCameraPosition.current);
          target.current.copy(defaultLookAt.current);
          camera.lookAt(target.current);
          focusOffset.current.set(0, 0, 5);
          isAnimating.current = false;
          activeTween.current = null;
          resolve();
        },
      });
    });
  };

  const landOnFocused = () => {
    if (!focusTarget.current) return Promise.resolve();

    stopActiveTween();
    const targetObj = focusTarget.current;
    const startCamera = camera.position.clone();
    const closeDistance = Math.max(0.72, focusDistance.current * 0.18);
    const progress = { value: 0 };

    isFollowing.current = false;
    isAnimating.current = true;

    return new Promise<void>((resolve) => {
      activeTween.current = gsap.to(progress, {
        value: 1,
        duration: 1.55,
        ease: 'power2.inOut',
        onUpdate: () => {
          const { cameraPos, targetPos } = getFocusedCameraPosition(targetObj, closeDistance);
          camera.position.lerpVectors(startCamera, cameraPos, progress.value);
          target.current.copy(targetPos);
          camera.lookAt(targetPos);
        },
        onComplete: () => {
          const { cameraPos, targetPos } = getFocusedCameraPosition(targetObj, closeDistance);
          camera.position.copy(cameraPos);
          target.current.copy(targetPos);
          camera.lookAt(targetPos);
          syncFocusOffset();
          isAnimating.current = false;
          activeTween.current = null;
          resolve();
        },
      });
    });
  };

  const riseFromSurface = (targetObj: THREE.Object3D, distance = 5) => {
    stopActiveTween();
    focusTarget.current = targetObj;
    focusDistance.current = distance;
    hasManualOrbit.current = false;
    isFollowing.current = false;
    isAnimating.current = true;

    const startDistance = Math.max(0.72, distance * 0.18);
    const progress = { value: 0 };

    return new Promise<void>((resolve) => {
      activeTween.current = gsap.to(progress, {
        value: 1,
        duration: 1.8,
        ease: 'power3.inOut',
        onStart: () => {
          const { cameraPos, targetPos } = getRadialCameraPosition(targetObj, startDistance);
          camera.position.copy(cameraPos);
          target.current.copy(targetPos);
          camera.lookAt(targetPos);
        },
        onUpdate: () => {
          const currentDistance = THREE.MathUtils.lerp(startDistance, distance, progress.value);
          const { cameraPos, targetPos } = getRadialCameraPosition(targetObj, currentDistance);
          camera.position.copy(cameraPos);
          target.current.copy(targetPos);
          camera.lookAt(targetPos);
        },
        onComplete: () => {
          const { cameraPos, targetPos } = getRadialCameraPosition(targetObj, distance);
          camera.position.copy(cameraPos);
          target.current.copy(targetPos);
          camera.lookAt(targetPos);
          syncFocusOffset();
          isAnimating.current = false;
          isFollowing.current = true;
          activeTween.current = null;
          resolve();
        },
      });
    });
  };

  useFrame(() => {
    if (isAnimating.current) return;

    // 若已聚焦某个目标，进入跟随模式
    if (focusTarget.current && isFollowing.current) {
      const targetPos = new THREE.Vector3();
      focusTarget.current.getWorldPosition(targetPos);
      target.current.copy(targetPos);

      if (!hasManualOrbit.current) {
        focusOffset.current.copy(getRadialDirection(targetPos).multiplyScalar(focusDistance.current));
      }

      if (focusOffset.current.lengthSq() > 0.0001) {
        focusOffset.current.setLength(focusDistance.current);
      }

      camera.position.copy(targetPos).add(focusOffset.current);
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

  useLayoutEffect(() => {
    registerControls({ focusOn, landOnFocused, resetView, riseFromSurface });
    // Camera control functions close over the current Three camera instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerControls]);

  return <>{children}</>;
}
