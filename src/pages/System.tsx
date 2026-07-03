import { Canvas } from "@react-three/fiber"
import { Suspense, useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import Sky from '@/components/Sky'
import CameraController from '@/components/CameraController'
import SolarSystem from "@/components/SolarSystem/SolarSystem"
import PlanetPanel from '@/components/PlanetPanel'
import { PlanetProvider } from '@/contexts/PlanetContext'
import './Page.css'

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
        <PlanetProvider>
            <div style={{ width: '100vw', height: '100vh' }}>
              <Canvas camera={{ position: [0, 20, 80], fov: 60 }}>
                <ambientLight intensity={0.34} />
                <hemisphereLight args={["#dceaff", "#17111f", 0.42]} />
                <pointLight position={[0, 0, 0]} intensity={9} distance={320} decay={1.05} color="#FFF0C2" />
                <Suspense fallback={null}>
                  <CameraController>
                    <SolarSystem returnTargetId={returnTargetId} onReturnComplete={handleReturnComplete} />
                  </CameraController>
                  <Sky />
                </Suspense>
              </Canvas>
              <PlanetPanel />
              {isReturning && (
                <div className="route-cloud route-cloud--lifting">
                  <div className="route-cloud__mist" />
                </div>
              )}
            </div>
        </PlanetProvider>
    )
}
