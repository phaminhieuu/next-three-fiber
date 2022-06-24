import { OrbitControls, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, { Suspense, useLayoutEffect, useMemo, useRef } from "react";
import Loader from "../components/loader";
import { Text3D, Center } from "@react-three/drei";

function Text({ content, matcap }) {
  const config = useMemo(
    () => ({
      size: 0.5,
      height: 0.2,
      curveSegments: 12,
      bevelEnabled: true,
      bevelThickness: 0.03,
      bevelSize: 0.02,
      bevelOffset: 0,
      bevelSegments: 5,
    }),
    []
  );

  return (
    <Center>
      <Text3D font={"/fonts/helvetiker_regular.typeface.json"} {...config}>
        {content}
        <meshMatcapMaterial {...matcap} />
      </Text3D>
    </Center>
  );
}

function Donut({ matcap }) {
  const donutMesh = useRef();

  useLayoutEffect(() => {
    if (donutMesh.current) {
      donutMesh.current.rotation.x = Math.random() * Math.PI;
      donutMesh.current.rotation.y = Math.random() * Math.PI;
    }
  }, []);

  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  return (
    <mesh position={[x, y, z]} ref={donutMesh}>
      <torusBufferGeometry args={[0.3, 0.2, 32, 64]} />
      <meshMatcapMaterial {...matcap} />
    </mesh>
  );
}

function Scene() {
  const props = useTexture({
    matcap: "/textures/matcaps/8.png",
  });

  return (
    <>
      <Text content="Nova Era" matcap={props} />;
      {new Array(100).fill(null).map((_, index) => (
        <Donut key={index} matcap={props} />
      ))}
    </>
  );
}

export default function TextThreeD() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [1, 1, 3], fov: 75, near: 0.1, far: 100 }}>
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
