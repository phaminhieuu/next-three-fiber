import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { OrbitControls, useTexture } from "@react-three/drei";
import Loader from "../components/loader";

function Scene() {
  const name = (type) => `/textures/brick/Bricks075A_1K_${type}.jpg`;

  const props = useTexture({
    map: name("Color"),
    displacementMap: name("Displacement"),
    normalMap: name("NormalGL"),
    roughnessMap: name("Roughness"),
    aoMap: name("AmbientOcclusion"),
  });

  return (
    <>
      <ambientLight intensity={0.2} />
      <directionalLight />
      <mesh>
        <boxBufferGeometry />
        <meshStandardMaterial displacementScale={0} {...props} />
      </mesh>
    </>
  );
}

export default function Texture() {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [1, 1, 1], fov: 75, near: 0.1, far: 100 }}>
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls autoRotate />
        </Suspense>
      </Canvas>
    </div>
  );
}
