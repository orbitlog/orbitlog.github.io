/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import type { PlanetInfo } from '@/types/planet';

interface PlanetContextType {
  selectedPlanet: PlanetInfo | null;
  setSelectedPlanet: (planet: PlanetInfo | null) => void;
  isNavigating: boolean;
  setIsNavigating: (value: boolean) => void;
  readyPlanets: string[];
  registerPlanet: (id: string, select: () => void) => () => void;
  selectPlanet: (id: string) => void;
}

const PlanetContext = createContext<PlanetContextType>({
  selectedPlanet: null,
  setSelectedPlanet: () => {},
  isNavigating: false,
  setIsNavigating: () => {},
  readyPlanets: [],
  registerPlanet: () => () => {},
  selectPlanet: () => {},
});

export const usePlanet = () => useContext(PlanetContext);

export function PlanetProvider({ children }: { children: ReactNode }) {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null);
  const [isNavigating, setIsNavigating] = useState(false);
  const [readyPlanets, setReadyPlanets] = useState<string[]>([]);
  const selectors = useRef(new Map<string, () => void>());

  const registerPlanet = useCallback((id: string, select: () => void) => {
    selectors.current.set(id, select);
    setReadyPlanets(Array.from(selectors.current.keys()));
    return () => {
      selectors.current.delete(id);
      setReadyPlanets(Array.from(selectors.current.keys()));
    };
  }, []);

  const selectPlanet = useCallback((id: string) => {
    selectors.current.get(id)?.();
  }, []);

  return (
    <PlanetContext.Provider value={{ selectedPlanet, setSelectedPlanet, isNavigating, setIsNavigating, readyPlanets, registerPlanet, selectPlanet }}>
      {children}
    </PlanetContext.Provider>
  );
}
