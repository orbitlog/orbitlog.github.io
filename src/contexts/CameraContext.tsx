// src/context/CameraContext.tsx
import { createContext, useContext } from 'react';
import * as THREE from 'three';

export const CameraContext = createContext<{
  focusOn: (target: THREE.Object3D, distance?: number) => Promise<void>;
  landOnFocused: () => Promise<void>;
  resetView: () => Promise<void>;
  riseFromSurface: (target: THREE.Object3D, distance?: number) => Promise<void>;
}>({
  focusOn: () => Promise.resolve(),
  landOnFocused: () => Promise.resolve(),
  resetView: () => Promise.resolve(),
  riseFromSurface: () => Promise.resolve(),
});

export const useCamera = () => useContext(CameraContext);
