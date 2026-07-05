// src/context/CameraContext.tsx
/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';

interface CameraControls {
  focusOn: (target: THREE.Object3D, distance?: number) => Promise<void>;
  landOnFocused: () => Promise<void>;
  resetView: () => Promise<void>;
  riseFromSurface: (target: THREE.Object3D, distance?: number) => Promise<void>;
}

interface CameraContextValue extends CameraControls {
  registerControls: (controls: CameraControls) => void;
}

const noopControls: CameraControls = {
  focusOn: () => Promise.resolve(),
  landOnFocused: () => Promise.resolve(),
  resetView: () => Promise.resolve(),
  riseFromSurface: () => Promise.resolve(),
};

export const CameraContext = createContext<CameraContextValue>({
  ...noopControls,
  registerControls: () => {},
});

export function CameraProvider({ children }: { children: ReactNode }) {
  const controlsRef = useRef<CameraControls>(noopControls);

  const value = useMemo<CameraContextValue>(() => ({
    focusOn: (target, distance) => controlsRef.current.focusOn(target, distance),
    landOnFocused: () => controlsRef.current.landOnFocused(),
    resetView: () => controlsRef.current.resetView(),
    riseFromSurface: (target, distance) => controlsRef.current.riseFromSurface(target, distance),
    registerControls: (controls) => {
      controlsRef.current = controls;
    },
  }), []);

  return (
    <CameraContext.Provider value={value}>
      {children}
    </CameraContext.Provider>
  );
}

export const useCamera = () => useContext(CameraContext);
