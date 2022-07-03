import {
  OrbitControls,
  useCubeTexture,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import Loader from "../components/loader";
import * as THREE from "three";
import { useControls } from "leva";

function Environment() {
  const { scene } = useThree();
  const envMap = new useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    { path: "/textures/environment/0/" }
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
  const group = useRef();
  const mesh = useRef();
  const { nodes } = useGLTF("/models/LeePerrySmith/LeePerrySmith.glb");

  const { envMapIntensity } = useControls({
    envMapIntensity: { value: 5, min: 0, max: 10, step: 0.001 },
  });

  const [map, normal] = new useTexture([
    "/models/LeePerrySmith/color.jpg",
    "/models/LeePerrySmith/normal.jpg",
  ]);

  useEffect(() => {
    map.encoding = THREE.sRGBEncoding;
    sceneCanvas.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        // child.material.envMap = environmentMap
        child.material.envMapIntensity = envMapIntensity;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, [envMapIntensity]);

  useLayoutEffect(() => {
    if (!mesh.current) return;
    
    mesh.current.material.map = map;
    mesh.current.material.normal = normal;
  }, []);

  return (
    <group
      ref={group}
      rotation={[0, Math.PI * 0.5, 0]}
      castShadow
      receiveShadow
    >
      <primitive object={nodes["LeePerrySmith"]} ref={mesh} />
      <meshStandardMaterial map={map} normalMap={normal} />
    </group>
  );
}

function Scene() {
  const directRef = useRef();
  useLayoutEffect(() => {
    if (!directRef.current) return;
    const shadow = directRef.current.shadow;
    shadow.camera.far = 15;
    shadow.mapSize.set(1024, 1024);
    shadow.normalBias = 0.05;
  }, []);

  const { lightIntensity, lightX, lightY, lightZ } = useControls({
    lightIntensity: { value: 3, min: 0, max: 10, step: 0.001 },
    lightX: { value: 0.25, min: -5, max: 5, step: 0.001 },
    lightY: { value: 3, min: -5, max: 5, step: 0.001 },
    lightZ: { value: -2.25, min: -5, max: 5, step: 0.001 },
  });
  return (
    <>
      <directionalLight
        ref={directRef}
        args={["#ffffff", lightIntensity]}
        castShadow={true}
        position={[lightX, lightY, lightZ]}
      />
      <Model />
    </>
  );
}

export default function ModifiedMaterial() {
  const { toneMappingExposure, toneMapping } = useControls({
    toneMappingExposure: { value: 3, min: 0, max: 10, step: 0.001 },
    toneMapping: {
      options: {
        Reinhard: THREE.ReinhardToneMapping,
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
      },
    },
  });

  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [4, 1, -4], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        legacy={true}
        shadows={true}
        gl={{
          physicallyCorrectLights: true,
          toneMapping,
          toneMappingExposure,
          antialias: true,
          outputEncoding: THREE.sRGBEncoding,
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
