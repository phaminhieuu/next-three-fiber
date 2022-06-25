import { OrbitControls, useHelper } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useLayoutEffect, useRef } from "react";
import Loader from "../components/loader";
import * as THREE from "three";
import {
  HemisphereLightHelper,
  DirectionalLightHelper,
  PointLightHelper,
  SpotLightHelper,
} from "three";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper.js";

function Scene() {
  //geometries
  const cubeRef = useRef();
  const torusRef = useRef();

  //lights
  const spotRef = useRef();
  const directRef = useRef();
  const hemisRef = useRef();
  const pointRef = useRef();
  const rectRef = useRef();

  useHelper(hemisRef, HemisphereLightHelper, 0.2);
  useHelper(directRef, DirectionalLightHelper, 0.2);
  useHelper(pointRef, PointLightHelper, 0.2);
  useHelper(spotRef, SpotLightHelper);
  useHelper(rectRef, RectAreaLightHelper);

  useLayoutEffect(() => {
    if (!spotRef.current || !rectRef) return;

    spotRef.current.target.position.x = -0.75;
    console.log("spot", spotRef.current.target.position);
    rectRef.current.lookAt(new THREE.Vector3());
    spotRef.current.lookAt(new THREE.Vector3(-0.75, 2, 3));
  });

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    cubeRef.current.rotation.x = 0.15 * a;
    cubeRef.current.rotation.y = 0.15 * a;
    torusRef.current.rotation.x = 0.1 * a;
    torusRef.current.rotation.y = 0.1 * a;
  });

  return (
    <>
      <ambientLight intensity={0.5} color={new THREE.Color(0xffffff)} />
      <directionalLight
        ref={directRef}
        position={[1, 0.25, 0]}
        color={new THREE.Color(0x00fffc)}
        intensity={0.3}
      />
      <hemisphereLight
        ref={hemisRef}
        args={[new THREE.Color(0xff0000), new THREE.Color(0x0000ff), 0.3]}
      />
      <pointLight
        ref={pointRef}
        position={[1, -0.5, 1]}
        args={[new THREE.Color(0xff9000), 0.5, 10, 2]}
      />
      <rectAreaLight
        ref={rectRef}
        position={[-1.5, 0, 1.5]}
        args={[new THREE.Color(0x4e00ff), 2, 1, 1]}
      />
      <spotLight
        ref={spotRef}
        position={[0, 2, 3]}
        args={[new THREE.Color(0x78ff00), 0.5, 10, Math.PI * 0.1, 0.25, 1]}
      />
      {/* Plane */}
      <mesh position={[0, -0.65, 0]} rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[5, 5]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>
      {/* Sphere */}
      <mesh position={[-1.5, 0, 0]}>
        <sphereBufferGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>
      {/* Cube */}
      <mesh ref={cubeRef}>
        <boxBufferGeometry args={[0.75, 0.75, 0.75]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>
      {/* Torus */}
      <mesh ref={torusRef} position={[1.5, 0, 0]}>
        <torusBufferGeometry args={[0.3, 0.2, 32, 64]} />
        <meshStandardMaterial roughness={0.4} />
      </mesh>
    </>
  );
}

export default function Light() {
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
