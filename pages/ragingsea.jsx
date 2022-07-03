import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useLayoutEffect, useRef } from "react";
import * as THREE from "three";
import Loader from "../components/loader";
import fragmentShader from "../shaders/water/fragment.glsl";
import vertexShader from "../shaders/water/vertex.glsl";
import { useControls } from "leva";

function Scene() {
  const shader = useRef();

  const {
    uBigWavesElevation,
    uBigWavesFrequencyX,
    uBigWavesFrequencyY,
    uBigWavesSpeed,
    depthColor,
    surfaceColor,
    uColorOffset,
    uColorMultiplier,
    uSmallWavesElevation,
    uSmallWavesFrequency,
    uSmallWavesSpeed,
    uSmallIterations,
  } = useControls({
    uBigWavesElevation: { value: 0.2, min: 0, max: 1, step: 0.001 },
    uBigWavesFrequencyX: { value: 4.0, min: 0, max: 10, step: 0.001 },
    uBigWavesFrequencyY: { value: 1.5, min: 0, max: 10, step: 0.001 },
    uBigWavesSpeed: { value: 0.75, min: 0, max: 4, step: 0.001 },
    depthColor: "#186691",
    surfaceColor: "#9bd8ff",
    uColorOffset: { value: 0.08, min: 0, max: 1, step: 0.001 },
    uColorMultiplier: { value: 5, min: 0, max: 10, step: 0.001 },
    uSmallWavesElevation: { value: 0.15, min: 0, max: 1, step: 0.001 },
    uSmallWavesFrequency: { value: 3, min: 0, max: 30, step: 0.001 },
    uSmallWavesSpeed: { value: 0.2, min: 0, max: 4, step: 0.001 },
    uSmallIterations: { value: 4, min: 0, max: 8, step: 1 },
  });

  useLayoutEffect(() => {
    if (!shader.current) return;
    const uniforms = shader.current.uniforms;
    uniforms.uBigWavesElevation = { value: uBigWavesElevation };
    uniforms.uBigWavesFrequency = {
      value: new THREE.Vector2(uBigWavesFrequencyX, uBigWavesFrequencyY),
    };
    uniforms.uTime = { value: 0 };
    uniforms.uBigWavesSpeed = { value: uBigWavesSpeed };

    uniforms.uSmallWavesElevation = { value: uSmallWavesElevation };
    uniforms.uSmallWavesFrequency = { value: uSmallWavesFrequency };
    uniforms.uSmallWavesSpeed = { value: uSmallWavesSpeed };
    uniforms.uSmallIterations = { value: uSmallIterations };

    uniforms.uDepthColor = { value: new THREE.Color(depthColor) };
    uniforms.uSurfaceColor = { value: new THREE.Color(surfaceColor) };
    uniforms.uColorOffset = { value: uColorOffset };
    uniforms.uColorMultiplier = { value: uColorMultiplier };
  }, [
    depthColor,
    surfaceColor,
    uBigWavesElevation,
    uBigWavesFrequencyX,
    uBigWavesFrequencyY,
    uBigWavesSpeed,
    uColorMultiplier,
    uColorOffset,
    uSmallWavesElevation,
    uSmallWavesFrequency,
    uSmallIterations,
    uSmallWavesSpeed,
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    shader.current.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      <mesh rotation={[-Math.PI * 0.5, 0, 0]}>
        <planeBufferGeometry args={[2, 2, 512, 512]} />
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
        legacy
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
