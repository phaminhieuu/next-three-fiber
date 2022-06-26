import { Loader, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  Suspense,
  useCallback,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { useControls } from "leva";
import * as THREE from "three";

const Scene = () => {
  const geomRef = useRef();
  const {
    count,
    size,
    radius,
    branches,
    spin,
    randomness,
    randomnessPower,
    insideColor,
    outsideColor,
  } = useControls({
    count: { value: 50000, min: 100, max: 1000000, step: 100 },
    size: { value: 0.01, min: 0.001, max: 0.1, step: 0.001 },
    radius: { value: 7, min: 0.01, max: 20, step: 0.01 },
    branches: { value: 10, min: 2, max: 20, step: 1 },
    spin: { value: 1, min: -5, max: 5, step: 0.001 },
    randomness: { value: 0.3, min: 0, max: 2, step: 0.001 },
    randomnessPower: { value: 3, min: 1, max: 10, step: 0.001 },
    insideColor: "#ff6030",
    outsideColor: "#1b3984",
  });

  const parameters = useMemo(() => {
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);

    const radiusValue = radius;
    const insideColorValue = insideColor;
    const outsideColorValue = outsideColor;

    const colorInside = new THREE.Color(insideColorValue);
    const colorOutside = new THREE.Color(outsideColorValue);

    for (let i = 0; i < count; i++) {
      // Position
      const i3 = i * 3;

      const radius = Math.random() * radiusValue;

      const spinAngle = radius * spin;
      const branchAngle = ((i % branches) / branches) * Math.PI * 2;

      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius;

      const randomY =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius;
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness *
        radius;

      positions[i3] = Math.cos(branchAngle + spinAngle) * radius + randomX;
      positions[i3 + 1] = randomY;
      positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ;

      // Color
      const mixedColor = colorInside.clone();
      mixedColor.lerp(colorOutside, radius / radiusValue);

      colors[i3] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    }
    return { positions, colors };
  }, [
    count,
    radius,
    insideColor,
    outsideColor,
    spin,
    branches,
    randomnessPower,
    randomness,
  ]);

  useLayoutEffect(() => {
    if (!geomRef.current) return;
    geomRef.current.setAttribute(
      "position",
      new THREE.BufferAttribute(parameters.positions, 3)
    );
    geomRef.current.setAttribute(
      "color",
      new THREE.BufferAttribute(parameters.colors, 3)
    );
  }, [parameters.positions, parameters.colors]);

  return (
    <>
      <points>
        <bufferGeometry ref={geomRef} />
        <pointsMaterial
          size={size}
          sizeAttenuation={true}
          depthWrite={false}
          blending={THREE.AdditiveBlending}
          vertexColors={true}
        />
      </points>
    </>
  );
};

export default function Galaxy() {
  return (
    <div className="w-full h-screen">
      <Canvas
        camera={{ position: [3, 3, 3], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        legacy={true}
      >
        <Suspense fallback={null}>
          <Scene />
          <OrbitControls autoRotate />
        </Suspense>
      </Canvas>
      <Loader />
    </div>
  );
}
