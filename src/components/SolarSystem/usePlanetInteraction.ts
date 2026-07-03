import { useCallback, useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import type * as THREE from 'three';
import { useCamera } from '@/contexts/CameraContext';
import { usePlanet } from '@/contexts/PlanetContext';
import { PLANET_DATA } from '@/types/planet';

export function usePlanetInteraction(
  planetId: string,
  objectRef: RefObject<THREE.Object3D | null>,
  distance: number,
  returnTargetId?: string,
  onReturnComplete?: () => void,
) {
  const { focusOn, riseFromSurface } = useCamera();
  const { setSelectedPlanet } = usePlanet();
  const hasHandledReturn = useRef(false);

  const selectPlanet = useCallback(() => {
    const object = objectRef.current;
    const planet = PLANET_DATA[planetId];

    if (!object || !planet) return;

    focusOn(object, distance);
    setSelectedPlanet(planet);
  }, [distance, focusOn, objectRef, planetId, setSelectedPlanet]);

  useEffect(() => {
    const object = objectRef.current;
    const planet = PLANET_DATA[planetId];

    if (!object || !planet || returnTargetId !== planetId || hasHandledReturn.current) {
      return;
    }

    hasHandledReturn.current = true;
    setSelectedPlanet(planet);
    riseFromSurface(object, distance).finally(() => {
      onReturnComplete?.();
    });
  }, [distance, objectRef, onReturnComplete, planetId, returnTargetId, riseFromSurface, setSelectedPlanet]);

  return selectPlanet;
}
