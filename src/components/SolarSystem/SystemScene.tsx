import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import Sky from '@/components/Sky';
import CameraController from '@/components/CameraController';
import SolarSystem from './SolarSystem';

interface SystemSceneProps {
  returnTargetId?: string;
  onReturnComplete: () => void;
}

export default function SystemScene({ returnTargetId, onReturnComplete }: SystemSceneProps) {
  return (
    <Canvas camera={{ position: [0, 20, 80], fov: 60 }} dpr={[1, 1.5]}>
      <ambientLight intensity={0.34} />
      <hemisphereLight args={['#dceaff', '#17111f', 0.42]} />
      <pointLight position={[0, 0, 0]} intensity={9} distance={320} decay={1.05} color="#FFF0C2" />
      <CameraController>
        <SolarSystem returnTargetId={returnTargetId} onReturnComplete={onReturnComplete} />
      </CameraController>
      <Suspense fallback={null}>
        <Sky />
      </Suspense>
    </Canvas>
  );
}
