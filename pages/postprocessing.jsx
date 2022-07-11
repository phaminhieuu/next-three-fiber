/* eslint-disable react-hooks/exhaustive-deps */
import {
  OrbitControls,
  useCubeTexture,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Loader from "../components/loader";
import * as THREE from "three";
import { useControls } from "leva";
import Effect from "../components/postPorcessing/Effect";

function Environment() {
  const { scene } = useThree();
  const envMap = new useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    { path: "/textures/environment/3/" }
  );

  useEffect(() => {
    envMap.encoding = THREE.sRGBEncoding;
    scene.environment = envMap;
    scene.background = envMap;
  }, []);

  return null;
}

function Model() {
  const sceneCanvas = useThree().scene;

  const object = useRef();

  const { scene } = useGLTF("/models/DamagedHelmet/glTF/DamagedHelmet.gltf");

  useLayoutEffect(() => {
    sceneCanvas.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        // child.material.envMap = environmentMap
        child.material.envMapIntensity = 5;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);

  useLayoutEffect(() => {
    if (!object.current) return;
    object.current.scale.set(2, 2, 2);
  }, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
  });

  return (
    <>
      <group rotation={[0, Math.PI * 0.5, 0]} castShadow receiveShadow>
        <primitive object={scene} ref={object} />
      </group>
    </>
  );
}

useGLTF.preload("/models/DamagedHelmet/glTF/DamagedHelmet.gltf");

function Scene() {
  const directRef = useRef();
  useLayoutEffect(() => {
    if (!directRef.current) return;
    const shadow = directRef.current.shadow;
    shadow.camera.far = 15;
    shadow.mapSize.set(1024, 1024);
    shadow.normalBias = 0.05;
  }, []);

  return (
    <>
      <directionalLight
        ref={directRef}
        args={["#ffffff", 3]}
        castShadow={true}
        position={[0.25, 2, -2.25]}
      />
      <Model />
      <Effect />
    </>
  );
}


export default function PostProcessing() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [4, 1, -4], fov: 75, near: 0.1, far: 100 }}
        linear
        legacy
        flat
        shadows={{ type: THREE.PCFShadowMap, enabled: true }}
        gl={{
          physicallyCorrectLights: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          antialias: true,
          outputEncoding: THREE.sRGBEncoding,
          powerPreference: "high-performance",
        }}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <Environment />

          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
