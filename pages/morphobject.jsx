import {
  FlyControls,
  Loader,
  OrbitControls,
  useTexture,
} from "@react-three/drei";
import { Canvas, extend, useFrame, useThree } from "@react-three/fiber";
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import * as THREE from "three";
import { useControls, button } from "leva";

function Lights() {
  const ref = useRef();
  useFrame(() => (ref.current.rotation.y = ref.current.rotation.z += 0.01));
  return (
    <group ref={ref}>
      <ambientLight intensity={0.5} />
      <directionalLight castShadow intensity={2} position={[30, 30, 50]} />
      <pointLight intensity={5} position={[0, 0, 0]} />
    </group>
  );
}

function Scene() {
  const mesh = useRef();
  const influence = useRef(0);
  const sphereFormation = [];
  const [shape, setShape] = useState(0);

  useControls({
    Sphere: button(() => setShape(1)),
    Cube: button(() => setShape(0)),
  });

  useEffect(() => {
    var geometry = mesh.current.geometry;

    // create an empty array to  hold targets for the attribute we want to morph
    // morphing positions and normals is supported
    geometry.morphAttributes.position = [];

    // the original positions of the cube's vertices
    const positionAttribute = geometry.attributes.position;
    // for the second morph target, we'll twist the cubes vertices

    for (let i = 0; i < positionAttribute.count; i++) {
      const x = positionAttribute.getX(i);
      const y = positionAttribute.getY(i);
      const z = positionAttribute.getZ(i);

      sphereFormation.push(
        x * Math.sqrt(1 - (y * y) / 2 - (z * z) / 2 + (y * y * z * z) / 3),
        y * Math.sqrt(1 - (z * z) / 2 - (x * x) / 2 + (z * z * x * x) / 3),
        z * Math.sqrt(1 - (x * x) / 2 - (y * y) / 2 + (x * x * y * y) / 3)
      );

      // stretch along the x-axis so we can see the twist better
    }
    geometry.morphAttributes.position[0] = new THREE.Float32BufferAttribute(
      sphereFormation,
      3
    );

    mesh.current.updateMorphTargets();
  });

  // useFrame(({ clock }) => {
  //   influence.current = Math.sin(clock.getElapsedTime());
  //   mesh.current.morphTargetInfluences[0] = influence.current;
  // });
  useEffect(() => {
    if (!mesh.current) return;
    mesh.current.morphTargetInfluences[0] = shape;
  }, [shape]);

  return (
    <>
      <Lights />
      {/* <Content /> */}
      {/* <Effects /> */}
      <mesh ref={mesh} morphTargetInfluences={[0]}>
        <boxBufferGeometry args={[2, 2, 2, 32, 32, 32]} />
        <meshNormalMaterial morphTargets side={THREE.DoubleSide} color="red" />
      </mesh>
    </>
  );
}

export default function Transform() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1, 1, 5], fov: 75, near: 0.1, far: 100 }}
        linear
        flat
        legacy
        shadows
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls autoRotate />
          {/* <FlyControls dragToLook={false} autoForward={false} /> */}
        </Suspense>
      </Canvas>
    </div>
  );
}
