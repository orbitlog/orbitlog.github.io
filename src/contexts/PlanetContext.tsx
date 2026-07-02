/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { PlanetInfo } from '@/types/planet';

interface PlanetContextType {
  selectedPlanet: PlanetInfo | null;
  setSelectedPlanet: (planet: PlanetInfo | null) => void;
}

const PlanetContext = createContext<PlanetContextType>({
  selectedPlanet: null,
  setSelectedPlanet: () => {},
});

export const usePlanet = () => useContext(PlanetContext);

export function PlanetProvider({ children }: { children: ReactNode }) {
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetInfo | null>(null);

  return (
    <PlanetContext.Provider value={{ selectedPlanet, setSelectedPlanet }}>
      {children}
    </PlanetContext.Provider>
  );
}
