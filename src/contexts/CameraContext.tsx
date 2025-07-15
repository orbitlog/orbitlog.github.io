// src/context/CameraContext.tsx
import { createContext, useContext } from 'react';
import * as THREE from 'three';

export const CameraContext = createContext<{
  focusOn: (target: THREE.Object3D, distance?: number) => void;
}>({
  focusOn: () => {},
});

export const useCamera = () => useContext(CameraContext);
