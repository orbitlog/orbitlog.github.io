// src/context/CameraContext.tsx
import { createContext, useContext } from 'react';
import * as THREE from 'three';

export const CameraContext = createContext<{
  focusOn: (target: THREE.Object3D, distance?: number) => void;
  resetView: () => void;
}>({
  focusOn: () => {},
  resetView: () => {},
});

export const useCamera = () => useContext(CameraContext);
