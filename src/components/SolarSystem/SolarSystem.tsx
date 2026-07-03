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

export default function SolarSystem({ returnTargetId, onReturnComplete }: SolarSystemProps) {
  return (
    <>
      <Sun returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Mercury returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Venus returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Earth returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Mars returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Jupiter returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Saturn returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Uranus returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      <Neptune returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
    </>
  );
}
