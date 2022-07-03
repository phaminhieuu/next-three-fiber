import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import Loader from "../components/loader";
import vertexShader from "../shaders/shader-patterns/vertex.glsl";
import fragmentShader from "../shaders/shader-patterns/fragment.glsl";

import { useControls } from "leva";

function Scene() {
  return (
    <>
      <mesh>
        <planeBufferGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial   
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
          side={THREE.DoubleSide}
        />
      </mesh>
    </>
  );
}

export default function Shaders() {
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
