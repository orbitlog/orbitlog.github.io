import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Sky from '@/components/Sky'
import CameraController from '@/components/CameraController'
import SolarSystem from "@/components/SolarSystem/SolarSystem"

export default function System() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <Canvas camera={{ position: [0, 5, 30], fov: 75 }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#ffcc33" />
            <Suspense fallback={null}>
              <CameraController>
                <SolarSystem />
              </CameraController>
              <Sky />
              
            </Suspense>
          </Canvas>
        </div>
    )
}