import { Html, useProgress } from "@react-three/drei";

export default function Loader() {
  const { progress } = useProgress();
  return (
    <Html center style={{ color: "white", display: "flex" }}>
      <div className="flex">{progress.toFixed(0)}% loaded</div>
    </Html>
  );
}
