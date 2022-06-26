import { useTexture } from "@react-three/drei";
import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const Door = () => {
  const name = (type) => `/textures/door/${type}.jpg`;
  const props = useTexture({
    map: name("color"),
    alphaMap: name("alpha"),
    aoMap: name("ambientOcclusion"),
    displacementMap: name("height"),
    normalMap: name("normal"),
    metalnessMap: name("metalness"),
    roughnessMap: name("roughness"),
  });

  const doorRef = useRef();

  useLayoutEffect(() => {
    if (!doorRef.current) return;
    doorRef.current.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(doorRef.current.attributes.uv.array, 2)
    );
  }, []);

  return (
    <mesh position={[0, 1, 2.01]}>
      <planeBufferGeometry args={[2, 2, 100, 100]} ref={doorRef} />
      <meshStandardMaterial
        {...props}
        transparent={true}
        displacementScale={0.1}
      />
    </mesh>
  );
};

export default React.memo(Door);
