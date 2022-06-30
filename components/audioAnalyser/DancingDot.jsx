import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import useStore from "../../store/store";

export default function DancingDot() {
  const { drums, snare } = useStore((state) => state.audio);
  const dot = useRef();
  useFrame((_) =>
    dot.current.rotation.set(
      Math.sin(_.clock.elapsedTime * 2) / 10 + (drums.avg * drums.gain) / 100,
      _.clock.elapsedTime + (snare.avg * snare.gain) / 100,
      0
    )
  );
  return (
    <group ref={dot}>
      <mesh position={[-1, 0.25, 0]}>
        <sphereGeometry args={[0.03, 32, 32]} />
        <meshBasicMaterial toneMapped={false} color="black" />
      </mesh>
    </group>
  );
}
