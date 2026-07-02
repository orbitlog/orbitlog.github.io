import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Sky from '@/components/Sky'
import CameraController from '@/components/CameraController'
import SolarSystem from "@/components/SolarSystem/SolarSystem"
import PlanetPanel from '@/components/PlanetPanel'
import { PlanetProvider } from '@/contexts/PlanetContext'

export default function System() {
    return (
        <PlanetProvider>
            <div style={{ width: '100vw', height: '100vh' }}>
              <Canvas camera={{ position: [0, 20, 80], fov: 60 }}>
                <ambientLight intensity={0.15} />
                <pointLight position={[0, 0, 0]} intensity={3} distance={200} decay={1.5} color="#FFF5E1" />
                <Suspense fallback={null}>
                  <CameraController>
                    <SolarSystem />
                  </CameraController>
                  <Sky />
                </Suspense>
              </Canvas>
              <PlanetPanel />
            </div>
        </PlanetProvider>
    )
}