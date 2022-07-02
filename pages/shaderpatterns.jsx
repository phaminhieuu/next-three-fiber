import { Canvas } from "@react-three/fiber";
import React, { Suspense } from "react";
import Loader from "../components/loader";
import vertexShader from "../shaders/ragingsea/vertex.glsl";
import fragmentShader from "../shaders/ragingsea/fragment.glsl";
import { OrbitControls } from "@react-three/drei";

function Scene() {
  return (
    <>
      <mesh>
        <planeBufferGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          vertexColors={vertexShader}
          fragmentShader={fragmentShader}
        />
      </mesh>
    </>
  );
}

export default function RagingSea() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1, 1, 1], fov: 75, near: 0.1, far: 100 }}
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
