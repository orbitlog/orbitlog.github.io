import { useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

export function useCameraFocus() {
  const { camera } = useThree();
  const focusTarget = useRef<THREE.Object3D | null>(null);

  function focusOn(object: THREE.Object3D) {
    const worldPosition = new THREE.Vector3();
    object.getWorldPosition(worldPosition);

    // 计算目标相机位置（星球前方 5 单位处）
    const direction = new THREE.Vector3().subVectors(camera.position, worldPosition).normalize();
    const newPosition = worldPosition.clone().add(direction.multiplyScalar(5)); // 5单位远

    // 动画移动相机
    gsap.to(camera.position, {
      x: newPosition.x,
      y: newPosition.y,
      z: newPosition.z,
      duration: 1.5,
      onUpdate: () => {
        camera.lookAt(worldPosition);
      },
    });

    focusTarget.current = object;
  }

  return { focusOn };
}
