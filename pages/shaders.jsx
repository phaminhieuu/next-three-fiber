import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import * as THREE from "three";
import Loader from "../components/loader";
// import vertexShader from "../shaders/test/vertex.glsl";
// import fragmentShader from "../shaders/test/fragment.glsl";

function Scene() {
  return (
    <>
      <mesh>
        <planeBufferGeometry args={[1, 1, 32, 32]} />
        {/* <rawShaderMaterial
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        /> */}
        <meshNormalMaterial />
      </mesh>
    </>
  );
}

export default function Shaders() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1, 1, 2], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        flat={true}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
