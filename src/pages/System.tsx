import { Canvas } from "@react-three/fiber"
import { Suspense } from "react"
import Sky from '@/components/Sky'
import Star from '@/components/Star'

export default function System() {
    return (
        <div style={{ width: '100vw', height: '100vh' }}>
          <Canvas camera={{ position: [0, 0, 20], fov: 60 }}>
            <ambientLight intensity={0.2} />
            <pointLight position={[0, 0, 0]} intensity={2} color="#ffcc33" />
            <Suspense fallback={null}>
              <Sky />
              <Star />
            </Suspense>
          </Canvas>
        </div>
    )
}