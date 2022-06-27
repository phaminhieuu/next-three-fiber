import { OrbitControls, Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, { Suspense, useLayoutEffect, useRef } from "react";
// import Loader from "../components/loader";
import * as THREE from "three";
import Floor from "../components/hauntedhouse/Floor";
import Walls from "../components/hauntedhouse/Walls";
import Roof from "../components/hauntedhouse/Roof";
import Door from "../components/hauntedhouse/Door";
import Lights from "../components/hauntedhouse/Lights";
import Graves from "../components/hauntedhouse/Graves";
import Bushes from "../components/hauntedhouse/Bushes";
import { Fog } from "three";

function Scene() {
  return (
    <>
      <Lights />
      <group>
        <Roof />
        <Walls />
        <Door />
        <Graves />
        <Bushes />
        <Floor />
      </group>
    </>
  );
}

export default function Particle() {
  return (
    <div className="w-full h-screen">
      <Canvas
        onCreated={(state) => {
          state.gl.setClearColor("#262837");
          state.scene.fog = new Fog("#262837", 1, 15);
        }}
        camera={{ position: [4, 2, 5], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        legacy={true}
        shadows
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
