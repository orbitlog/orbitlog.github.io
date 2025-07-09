import * as THREE from 'three';
import { useMemo } from 'react';
import { Line } from '@react-three/drei';

interface Props {
  a: number; // 长半轴
  b: number; // 短半轴
  segments?: number;
  color?: string;
}

export default function OrbitEllipse({ a, b, segments = 128, color = 'white' }: Props) {
  const points = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= segments; i++) {
      const angle = (i / segments) * 2 * Math.PI;
      const x = a * Math.cos(angle);
      const z = b * Math.sin(angle);
      pts.push(new THREE.Vector3(x, 0, z));
    }
    return pts;
  }, [a, b, segments]);

  return <Line points={points} color={color} lineWidth={1} />;
}
