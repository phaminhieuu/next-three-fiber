import { OrbitControls, PointMaterial, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loader from "../components/loader";
import * as THREE from "three";

function Scene() {
  //Setup positions and colors for particles
  const particlesValue = useMemo(() => {
    const count = 50000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 10;
      colors[i] = Math.random();
    }

    return {
      count,
      positions,
      colors,
    };
  }, []);

  //Load texture
  const props = useTexture({
    alphaMap: "/textures/particles/5.png",
  });

  const geomRef = useRef();

  useLayoutEffect(() => {
    if (!geomRef.current && !material.current) return;
    geomRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(particlesValue.positions, 3)
    );
    geomRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(particlesValue.colors, 3)
    );
  }, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();

    for (let i = 0; i < particlesValue.count; i++) {
      let i3 = i * 3;
      const x = geomRef.current.attributes.position.array[i3];
      geomRef.current.attributes.position.array[i3 + 1] = Math.sin(
        elapsedTime + x
      );
    }

    geomRef.current.attributes.position.needsUpdate = true;
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight color />
      <points>
        <bufferGeometry
          ref={geomRef}
          //   setAttribute={attribute}
        />
        {/* <pointMaterial {...props} ref={materialRef} /> */}
        <pointsMaterial
          {...props}
          size={0.1}
          sizeAttenuation={true}
          color={new THREE.Color("#ff88cc")}
          transparent={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
    </>
  );
}

export default function Particle() {
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
