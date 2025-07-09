export default function Sun() {
  return (
    <mesh>
      <sphereGeometry args={[2, 64, 64]} />
      <meshBasicMaterial color="orange" />
    </mesh>
  );
}
