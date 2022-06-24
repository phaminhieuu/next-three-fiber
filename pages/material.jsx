import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useLayoutEffect, useRef } from "react";
import { OrbitControls, useCubeTexture } from "@react-three/drei";
import { useControls } from "leva";
import * as THREE from "three";
import Loader from "../components/loader";

function Sphere({ envMap, roughness, metalness }) {
  const myMesh = useRef();
  const geomRef = useRef();

  useLayoutEffect(() => {
    if (geomRef.current) {
      geomRef.current.setAttribute(
        "uv2",
        new THREE.BufferAttribute(geomRef.current.attributes.uv.array, 2)
      );
    }
  });

  // ============== With useUpdate hook ========================
  // const geomRef = useUpdate((geometry) => {
  //   geometry.setAttribute(
  //     "uv2",
  //     new BufferAttribute(geometry.attributes.uv.array, 2)
  //   );
  // }, []);

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.x = 0.15 * a;
    myMesh.current.rotation.y = 0.1 * a;
  });
  return (
    <mesh position={[-1.5, 0, 0]} ref={myMesh}>
      <sphereBufferGeometry
        ref={geomRef}
        attach="geometry"
        args={[0.5, 64, 64]}
      />

      <meshStandardMaterial
        metalness={metalness}
        roughness={roughness}
        envMap={envMap}
        aoMapIntensity={1}
      />
    </mesh>
  );
}

function Plane({ envMap, roughness, metalness }) {
  const myMesh = useRef();
  const geomRef = useRef();

  useLayoutEffect(() => {
    if (geomRef.current) {
      geomRef.current.setAttribute(
        "uv2",
        new THREE.BufferAttribute(geomRef.current.attributes.uv.array, 2)
      );
    }
  });

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.x = 0.15 * a;
    myMesh.current.rotation.y = 0.1 * a;
  });
  return (
    <mesh ref={myMesh}>
      <planeBufferGeometry
        ref={geomRef}
        attach="geometry"
        args={[1, 1, 100, 100]}
      />
      <meshStandardMaterial
        metalness={metalness}
        roughness={roughness}
        envMap={envMap}
      />
    </mesh>
  );
}

function Torus({ envMap, roughness, metalness }) {
  const myMesh = useRef();

  const geomRef = useRef();

  useLayoutEffect(() => {
    if (geomRef.current) {
      geomRef.current.setAttribute(
        "uv2",
        new THREE.BufferAttribute(geomRef.current.attributes.uv.array, 2)
      );
    }
  });

  useFrame(({ clock }) => {
    const a = clock.getElapsedTime();
    myMesh.current.rotation.x = 0.15 * a;
    myMesh.current.rotation.y = 0.1 * a;
  });
  return (
    <mesh position={[1.5, 0, 0]} ref={myMesh}>
      <torusBufferGeometry
        ref={geomRef}
        attach="geometry"
        args={[0.3, 0.2, 64, 128]}
      >
      </torusBufferGeometry>
      <meshStandardMaterial
        metalness={metalness}
        roughness={roughness}
        envMap={envMap}
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
    roughness: { value: 0.2, min: 0, max: 1, step: 0.0001 },
    metalness: { value: 0.7, min: 0, max: 1, step: 0.0001 },
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
      <Canvas camera={{ position: [1, 1, 2], fov: 75, near: 0.1, far: 100 }}>
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
