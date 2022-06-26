import { useTexture } from "@react-three/drei";
import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const Walls = () => {
  const name = (type) => `/textures/bricks/${type}.jpg`;

  const props = useTexture({
    map: name("color"),
    aoMap: name("ambientOcclusion"),
    normalMap: name("normal"),
    roughnessMap: name("roughness"),
  });

  const wallRef = useRef();

  useLayoutEffect(() => {
    if (!wallRef.current) return;
    wallRef.current.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(wallRef.current.attributes.uv.array, 2)
    );
  }, []);
  return (
    <>
      <mesh position={[0, 1.25, 0]}>
        <boxBufferGeometry args={[4, 2.5, 4]} ref={wallRef} />
        <meshStandardMaterial {...props} />
      </mesh>
    </>
  );
};

export default React.memo(Walls);
