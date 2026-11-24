import { lazy, Suspense, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import PlanetPanel from '@/components/PlanetPanel'
import CloudCurtain from '@/components/CloudCurtain'
import { PlanetProvider, usePlanet } from '@/contexts/PlanetContext'
import SystemNavigation from '@/components/SystemNavigation'
import { CameraProvider } from '@/contexts/CameraContext'
import './System.css'

const SystemScene = lazy(() => import('@/components/SolarSystem/SystemScene'));

interface RouteState {
  returnFrom?: string;
}

export default function System() {
    const location = useLocation();
    const navigate = useNavigate();
    const routeReturnTargetId = (location.state as RouteState | null)?.returnFrom;
    const [returnTargetId, setReturnTargetId] = useState(routeReturnTargetId);
    const [isReturning, setIsReturning] = useState(Boolean(routeReturnTargetId));

    useEffect(() => {
      if (!routeReturnTargetId) return;

      setReturnTargetId(routeReturnTargetId);
      setIsReturning(true);
      navigate('.', { replace: true, state: null });
    }, [navigate, routeReturnTargetId]);

    const handleReturnComplete = () => {
      window.setTimeout(() => {
        setIsReturning(false);
        setReturnTargetId(undefined);
      }, 220);
    };

    return (
      <CameraProvider>
        <PlanetProvider>
            <SystemContent returnTargetId={returnTargetId} isReturning={isReturning} onReturnComplete={handleReturnComplete} />
        </PlanetProvider>
      </CameraProvider>
    )
}

function SystemContent({ returnTargetId, isReturning, onReturnComplete }: {
  returnTargetId?: string;
  isReturning: boolean;
  onReturnComplete: () => void;
}) {
  const { isNavigating, selectedPlanet } = usePlanet();
  return (
    <main className={`system-page${selectedPlanet ? ' has-selection' : ''}${isNavigating || isReturning ? ' is-busy' : ''}`}>
      <div className="system-scene" aria-label="交互式三维太阳系，可通过星球与模块目录选择目的地">
        <Suspense fallback={null}>
          <SystemScene returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
        </Suspense>
      </div>
      <div className="system-shade" aria-hidden="true" />
      <SystemNavigation isReturning={isReturning} />
      <PlanetPanel />
      {isReturning && <CloudCurtain className="route-cloud route-cloud--lifting" />}
    </main>
  );
}
