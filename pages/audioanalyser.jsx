import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Overlay from "../components/audioAnalyser/Overlay";
// import Graph from "../components/audioAnalyser/Graph";
// import DancingDot from "../components/audioAnalyser/DancingDot";
// import Bust from "../components/audioAnalyser/Bust";
// import Explosion from "../components/audioAnalyser/Explosion";
// import Ground from "../components/audioAnalyser/Ground";
// import Intro from "../components/audioAnalyser/Intro";

export default function AudioAnalyser() {
  return (
    <>
      {/* <Overlay /> */}
      <div className="w-full h-screen">
        <Canvas
          dpr={[1, 2]}
          camera={{ position: [-1, 10, 10], fov: 25 }}
          linear
          flat
          legacy
        >
          <color attach="background" args={["#d0d0d0"]} />
          <fog attach="fog" args={["#d0d0d0", 5, 10]} />
          <Suspense fallback={null}>
            <ambientLight intensity={2} />
            <directionalLight position={[10, 10, 0]} intensity={1.5} />
            <directionalLight position={[-10, 10, 5]} intensity={1} />
            <directionalLight position={[-10, 20, 0]} intensity={1.5} />
            <directionalLight position={[0, -10, 0]} intensity={0.25} />
            <group position-y={-0.25}>
              <mesh>
                <boxBufferGeometry />
                <meshNormalMaterial />
              </mesh>
              {/* <Graph position={[-0.7, -0.2, -1]} /> */}
              {/* <DancingDot /> */}
              {/* <Bust /> */}
              {/* <Explosion position={[0, 0.65, 0]} beat={0} /> */}
              {/* <Explosion position={[0.15, 0.25, 0]} beat={1} /> */}
              {/* <Ground /> */}
            </group>
            {/* <Intro /> */}
          </Suspense>
          <OrbitControls />
        </Canvas>
      </div>
    </>
  );
}
