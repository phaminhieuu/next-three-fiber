import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useControls } from "leva";
import * as THREE from "three";
import vertexShader from "../shaders/galaxy/vertex.glsl";
import fragmentShader from "../shaders/galaxy/fragment.glsl";

const Scene = () => {
  const mesh = useRef();
  const geomRef = useRef();
  const shader = useRef();
  const {
    count,
    radius,
    branches,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
  } = useControls({
    count: { value: 200000, min: 100, max: 1000000, step: 100 },
    radius: { value: 5, min: 0.01, max: 20, step: 0.01 },
    branches: { value: 3, min: 2, max: 20, step: 1 },
    randomness: { value: 0.2, min: 0, max: 2, step: 0.001 },
    randomnessPower: { value: 3, min: 1, max: 10, step: 0.001 },
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  });

  const parameters = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const randomnessValue = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const scales = new Float32Array(count * 1);

    const colorInside = new THREE.Color(insideColor);
    const colorOutside = new THREE.Color(outsideColor);

    for (let i = 0; i < count; i++) {
      // Position
      const i3 = i * 3;

      const radiusValue = Math.random() * radius;

      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radiusValue;

      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radiusValue;
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radiusValue;

      positions[i3] = Math.cos(branchAngle) * radiusValue;
      positions[i3 + 1] = 0;
      positions[i3 + 2] = Math.sin(branchAngle) * radiusValue;

      randomnessValue[i3] = randomX;
      randomnessValue[i3 + 1] = randomY;
      randomnessValue[i3 + 2] = randomZ;

      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radiusValue / radius);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;

      //Scale
      scales[i] = Math.random();
    }
    return { positions, colors, scales, randomnessValue };
  }, [
    count,
    radius,
    insideColor,
    outsideColor,
    branches,
    randomnessPower,
    randomness,
  ]);

  useLayoutEffect(() => {
    if (!geomRef.current || !shader.current) return;
    geomRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(parameters.positions, 3)
    );
    geomRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(parameters.colors, 3)
    );
    geomRef.current.setAttribute(
      "aScale",
      new THREE.BufferAttribute(parameters.scales, 1)
    );
    geomRef.current.setAttribute(
      "aRandomness",
      new THREE.BufferAttribute(parameters.randomnessValue, 3)
    );

    const uniforms = shader.current.uniforms;
    uniforms.uSize = { value: 8 * Math.min(window.devicePixelRatio, 2) };
    uniforms.uTime = { value: 0 };

    console.log(mesh.current);
  }, [
    parameters.positions,
    parameters.colors,
    parameters.scales,
    parameters.randomnessValue,
  ]);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    shader.current.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      <points ref={mesh}>
        <bufferGeometry ref={geomRef} />
        <shaderMaterial
          ref={shader}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
          vertexShader={vertexShader}
          fragmentShader={fragmentShader}
        />
      </points>
    </>
  );
};

export default function AnimatedGalaxy() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [3, 3, 3], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        legacy={true}
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
