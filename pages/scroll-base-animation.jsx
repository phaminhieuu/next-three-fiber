import { OrbitControls } from "@react-three/drei";
import { Canvas, useThree } from "@react-three/fiber";
import React, { Fragment, Suspense, useRef, useState } from "react";
import { Html, useProgress } from "@react-three/drei";
import { Section } from "../components/ScrollBaseAnimation/Section";

function Scene() {
  const { size, viewPort } = useThree();

  console.log("size", size);
  console.log("viewPort", viewPort);
  return (
    <>
      <mesh>
        <boxBufferGeometry />
        <meshNormalMaterial />
      </mesh>
    </>
  );
}

const HTMLContent = () => {
  return (
    // <Section factor={1.5} offset={1}>
    <group position={[0, -1, 0]}>
      <mesh>
        <boxBufferGeometry />
        <meshNormalMaterial />
      </mesh>
      <Html fullscreen center>
        <div className="absolute top-0 right-0">
          <h1 className="text-white text-5xl">My Portfolio</h1>
        </div>
      </Html>
    </group>
    // </Section>
  );
};

export default function ScrollBaseAnimation() {
  const domContent = useRef();
  const [events, setEvents] = useState();

  return (
    <div className="h-screen w-full">
      <Canvas
        camera={{ position: [1, 1, 5], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        flat={true}
        legacy={true}
      >
        <Suspense fallback={null}>
          {/* <HTMLContent /> */}

          <mesh>
            <boxBufferGeometry />
            <meshNormalMaterial />
          </mesh>
          <Html>
            <div className="absolute top-0 right-0">
              <h1 className="text-white text-5xl">My Portfolio</h1>
            </div>
          </Html>
        </Suspense>
      </Canvas>
    </div>
  );
}
