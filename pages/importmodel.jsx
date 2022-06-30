import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Loader from "../components/loader";
import * as THREE from "three";
import { Vector2 } from "three";
import { useGLTF, useAnimations } from "@react-three/drei";

function Model(props) {

  const group = useRef();
  const actions = useRef();
  const [mixer] = useState(() => new THREE.AnimationMixer());
  const { nodes, materials, animations } = useGLTF("/models/Fox/glTF/Fox.gltf");

  useFrame((state, delta) => {
    mixer?.update(delta);
  });

  useEffect(() => {
    actions.current = { idle: mixer.clipAction(animations[2], group.current) };
    actions.current.idle.play();
    return () => animations.forEach((clip) => mixer.uncacheClip(clip));
  }, []);

  return (
    <group ref={group} dispose={null} scale={[0.025, 0.025, 0.025]}>
      <mesh castShadow receiveShadow>
        <primitive object={nodes["root"]} attac />
      </mesh>
    </group>
  );
}

useGLTF.preload("/models/Fox/gltf/Fox.gltf");

function Scene() {
  const directRef = useRef();

  useLayoutEffect(() => {
    if (!directRef.current) return;
    const camera = directRef.current.shadow.camera;
    camera.far = 15;
    camera.left = -7;
    camera.top = 7;
    camera.right = 7;
    camera.bottom = -7;
    directRef.current.shadow.mapSize = new Vector2(1024, 1024);
  }, []);

  return (
    <>
      <ambientLight color={new THREE.Color(0xffffff)} intensity={0.8} />

      <directionalLight
        ref={directRef}
        color={new THREE.Color(0xffffff)}
        intensity={0.6}
        castShadow={true}
        position={[-5, 5, 0]}
      />

      <mesh receiveShadow={true} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[10, 10]} />
        <meshStandardMaterial color="#444444" metalness={0} roughness={0.5} />
      </mesh>
      <Model />
    </>
  );
}

export default function ImportModel() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [2, 2, 2], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        flat={true}
        legacy={true}
        shadows={true}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
