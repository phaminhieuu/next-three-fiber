import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useRef } from "react";
import { OrbitControls, useTexture, useCubeTexture } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";

function Sphere(envMap, roughness, metalness) {
  const myMesh = useRef();

  console.log("rough", roughness);

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.x = 0.15 * a;
    myMesh.current.rotation.y = 0.1 * a;
  });
  return (
    <mesh position={[-1.5, 0, 0]} ref={myMesh}>
      <sphereBufferGeometry attach="geometry" args={[0.5, 64, 64]}>
        <bufferAttribute attach="uv2" array={2} />
      </sphereBufferGeometry>
      <meshStandardMaterial
        metalness={metalness}
        roughness={roughness}
        envMap={envMap.envMap}
      />
    </mesh>
  );
}

function Plane(envMap) {
  const myMesh = useRef();
  console.log(envMap);

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.x = 0.15 * a;
    myMesh.current.rotation.y = 0.1 * a;
  });
  return (
    <mesh ref={myMesh}>
      <planeBufferGeometry args={[1, 1, 100, 100]} />
      <meshStandardMaterial
        metalness={0.7}
        roughness={0.2}
        envMap={envMap.envMap}
      />
    </mesh>
  );
}

function Torus(envMap) {
  const myMesh = useRef();

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.x = 0.15 * a;
    myMesh.current.rotation.y = 0.1 * a;
  });
  return (
    <mesh position={[1.5, 0, 0]} ref={myMesh}>
      <torusBufferGeometry args={[0.3, 0.2, 64, 128]}>
        <bufferAttribute attach="uv2" array={2} />
      </torusBufferGeometry>
      <meshStandardMaterial
        metalness={0.7}
        roughness={0.2}
        envMap={envMap.envMap}
      />
    </mesh>
  );
}

function Scene() {
  const envMap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    { path: "/textures/environment/0/" }
  );

  const { roughness, metalness } = useControls({
    roughness: { value: 0.7, min: 0, max: 1, step: 0.0001 },
    metalness: { value: 0.2, min: 0, max: 1, step: 0.0001 },
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight intensity={0.5} position={[2, 3, 4]} />
      <Sphere envMap={envMap} roughness={roughness} metalness={metalness} />
      <Plane envMap={envMap} roughness={roughness} metalness={metalness} />
      <Torus envMap={envMap} roughness={roughness} metalness={metalness} />
    </>
  );
}

export default function Material() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [1, 1, 2], fov: 75, near: 1, far: 100 }}>
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
