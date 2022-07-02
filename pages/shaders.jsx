import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import Loader from "../components/loader";
import vertexShader from "../shaders/test/vertex.glsl";
import fragmentShader from "../shaders/test/fragment.glsl";

import { useControls } from "leva";

function Scene() {
  const mesh = useRef();
  const shader = useRef();

  const [map] = useTexture(["/images/co-viet-nam.jpg"]);

  const { frequencyX, frequencyY } = useControls({
    frequencyX: { value: 10, min: 0, max: 20, step: 0.01 },
    frequencyY: { value: 5, min: 0, max: 20, step: 0.01 },
  });

  useLayoutEffect(() => {
    if (!mesh.current) return;
    //Geometry
    const geometry = mesh.current.geometry;

    const count = geometry.attributes.position.count;
    const randoms = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      randoms[i] = Math.random();
    }

    geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));
  }, []);

  useLayoutEffect(() => {
    if (!shader.current) return;
    shader.current.uniforms.uFrequency = {
      value: new THREE.Vector2(frequencyX, frequencyY),
    };
    shader.current.uniforms.uTime = { value: 0 };
    shader.current.uniforms.uColor = { value: new THREE.Color("orange") };
    shader.current.uniforms.uTexture = { value: map };
  }, [frequencyX, frequencyY, map]);

  useFrame(({ clock }) => {
    const elapedTime = clock.getElapsedTime() * 5;
    shader.current.uniforms.uTime.value = elapedTime;
  });

  return (
    <>
      <mesh ref={mesh}>
        <planeBufferGeometry args={[1, 1, 32, 32]} />
        <shaderMaterial
          ref={shader}
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
