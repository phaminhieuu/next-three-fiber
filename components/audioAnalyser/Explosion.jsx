import { useAnimations, useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import React, { useMemo, useRef, useState } from "react";
import { vec } from "../../constants/analyser";
import useStore from "../../store/store";
import * as THREE from "three";

export default function Explosion({ beat, ...props }) {
  const [state] = useState({ size: 0, signal: 0 });
  const sceneRef = useRef();
  const instance = useRef();
  const sphere = useRef();
  // The GLTF only contains a point-cloud and baked keyframes for the explosion
  const { scene: originalScene, animations } = useGLTF(
    "/analyser/explosion.glb"
  );
  const scene = useMemo(() => originalScene.clone(true), [originalScene]);
  const { actions, mixer } = useAnimations(animations, sceneRef);
  const { drums, snare } = useStore((state) => state.audio);
  const track = useStore((state) => state.track);
  mixer.timeScale = 2;
  // Can reset and play all actions
  const play = () =>
    Object.keys(actions).forEach((key) => {
      actions[key].setLoop(THREE.LoopOnce).stop().reset();
      actions[key].play();
    });
  // Control the sphere and the sparks
  useFrame(() => {
    if (drums.signal && track.kicks - 1 === beat && drums.gain)
      play((state.size = 1));
    if (snare.signal) state.size = 0;
    sphere.current.scale.lerp(
      vec.set(
        state.size * drums.gain,
        state.size * drums.gain,
        state.size * drums.gain
      ),
      0.2
    );
    sphere.current.children[0].intensity = drums.avg * drums.gain * 10;
    // This code transforms the empty GLTF nodes into a single drawcall via instancing
    sceneRef.current.children.forEach((node, i) =>
      instance.current.setMatrixAt(i, node.matrix)
    );
    instance.current.visible = !!drums.gain;
    instance.current.instanceMatrix.needsUpdate = true;
  });
  return (
    <group {...props}>
      <mesh ref={sphere}>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshBasicMaterial toneMapped={false} transparent opacity={0.95} />
        <pointLight color="red" distance={0.5} />
      </mesh>
      <group scale={[0.05, 0.05, 0.05]}>
        <primitive ref={sceneRef} object={scene} />
        <instancedMesh
          ref={instance}
          args={[null, null, originalScene.children.length]}
        >
          <circleGeometry args={[0.15, 0]} />
          <meshBasicMaterial toneMapped={false} />
        </instancedMesh>
      </group>
    </group>
  );
}
