import { Suspense } from 'react';
import Sun from './Sun';
import Mercury from './Plantes/Mercury';
import Venus from './Plantes/Venus';
import Earth from './Plantes/Earth';
import Mars from './Plantes/Mars';
import Jupiter from './Plantes/Jupiter';
import Saturn from './Plantes/Saturn';
import Uranus from './Plantes/Uranus';
import Neptune from './Plantes/Neptune';

interface SolarSystemProps {
  returnTargetId?: string;
  onReturnComplete?: () => void;
}

const planets = [Sun, Mercury, Venus, Earth, Mars, Jupiter, Saturn, Uranus, Neptune];

export default function SolarSystem({ returnTargetId, onReturnComplete }: SolarSystemProps) {
  return (
    <>
      {planets.map((Planet, index) => (
        <Suspense key={index} fallback={null}>
          <Planet returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
        </Suspense>
      ))}
    </>
  );
}
