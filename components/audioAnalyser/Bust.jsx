import { useAnimations, useGLTF } from "@react-three/drei";
import React, { useEffect, useRef } from "react";
import useStore from "../../store/store";
import * as THREE from "three";
import { useFrame } from "@react-three/fiber";

export default function Bust() {
  const ref = useRef();
  const time = useRef(0);
  const { scene, animations, materials } = useGLTF("/analyser/bust.glb");
  const { actions, mixer } = useAnimations(animations, ref);
  const { drums } = useStore((state) => state.audio);
  const track = useStore((state) => state.track);
  // Play all actions (the fragments flying off)
  useEffect(() => {
    Object.keys(actions).forEach((key) => actions[key].play());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // Control the exploding statue and the inner materials color
  useFrame((_) => {
    mixer.timeScale = track.synthonly ? 0.125 : 1;
    if (!track.synthonly)
      mixer.setTime(
        (time.current = THREE.MathUtils.lerp(
          time.current,
          track.kicks * 1.25,
          track.kicks === 0 ? 0.25 : 0.15
        ))
      );
    materials.inner.color
      .copy(new THREE.Color("#900909"))
      .multiplyScalar((drums.avg * drums.gain) / 30);
  });
  return (
    <primitive
      scale={[0.2, 0.2, 0.2]}
      position={[0, -0.23, 0]}
      rotation={[0, -2.4, 0]}
      ref={ref}
      object={scene}
    />
  );
}
