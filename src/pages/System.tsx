import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sky from '@/components/Sky'
import CameraController from '@/components/CameraController'
import SolarSystem from "@/components/SolarSystem/SolarSystem"
import PlanetPanel from '@/components/PlanetPanel'
import CloudCurtain from '@/components/CloudCurtain'
import { PlanetProvider, usePlanet } from '@/contexts/PlanetContext'
import SystemNavigation from '@/components/SystemNavigation'
import { CameraProvider } from '@/contexts/CameraContext'
import './System.css'

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
        <Canvas camera={{ position: [0, 20, 80], fov: 60 }}>
          <ambientLight intensity={0.34} />
          <hemisphereLight args={["#dceaff", "#17111f", 0.42]} />
          <pointLight position={[0, 0, 0]} intensity={9} distance={320} decay={1.05} color="#FFF0C2" />
          <Suspense fallback={null}>
            <CameraController>
              <SolarSystem returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
            </CameraController>
            <Sky />
          </Suspense>
        </Canvas>
      </div>
      <div className="system-shade" aria-hidden="true" />
      <SystemNavigation isReturning={isReturning} />
      <PlanetPanel />
      {isReturning && <CloudCurtain className="route-cloud route-cloud--lifting" />}
    </main>
  );
}
