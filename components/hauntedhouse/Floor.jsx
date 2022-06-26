import { useTexture } from "@react-three/drei";
import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const Floor = () => {
  const name = (type) => `/textures/grass/${type}.jpg`;

  const floorRef = useRef();

  useLayoutEffect(() => {
    if (!floorRef.current) return;
    floorRef.current.setAttribute(
      "uv2",
      new THREE.Float32BufferAttribute(floorRef.current.attributes.uv.array, 2)
    );
  }, []);

  const [map, aoMap, normalMap, roughnessMap] = useTexture([
    name("color"),
    name("ambientOcclusion"),
    name("normal"),
    name("roughness"),
  ]);

  map.repeat.set(8, 8);
  map.wrapS = THREE.RepeatWrapping;
  map.wrapT = THREE.RepeatWrapping;

  aoMap.repeat.set(8, 8);
  aoMap.wrapS = THREE.RepeatWrapping;
  aoMap.wrapT = THREE.RepeatWrapping;

  normalMap.repeat.set(8, 8);
  normalMap.wrapS = THREE.RepeatWrapping;
  normalMap.wrapT = THREE.RepeatWrapping;

  roughnessMap.repeat.set(8, 8);
  roughnessMap.wrapS = THREE.RepeatWrapping;
  roughnessMap.wrapT = THREE.RepeatWrapping;

  return (
    <mesh
      rotation={[-Math.PI * 0.5, 0, 0]}
      receiveShadow={true}
      position={[0, 0, 0]}
    >
      <planeBufferGeometry args={[20, 20]} ref={floorRef} />
      <meshStandardMaterial
        map={map}
        aoMap={aoMap}
        normalMap={normalMap}
        roughnessMap={roughnessMap}
      />
    </mesh>
  );
};

export default React.memo(Floor);
