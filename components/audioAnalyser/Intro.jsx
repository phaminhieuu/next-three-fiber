import { useFrame } from "@react-three/fiber";
import { useEffect } from "react";
import { vec } from "../../constants/analyser";
import useStore from "../../store/store";

export default function Intro() {
  const clicked = useStore((state) => state.clicked);
  const api = useStore((state) => state.api);
  useEffect(() => {
    (async () => {
      api.loaded();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Zoom in camera when user has pressed start
  return useFrame((state) => {
    if (clicked) {
      state.camera.position.lerp(vec.set(-2 + state.mouse.x, 2, 4.5), 0.05);
      state.camera.lookAt(0, 0, 0);
    }
  });
}
