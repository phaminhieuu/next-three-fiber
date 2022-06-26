import React from "react";
import * as THREE from "three";

const Roof = () => {
  return (
    <mesh position={[0, 3, 0]} rotation={[0, Math.PI * 0.25, 0]}>
      <coneBufferGeometry args={[3.5, 1, 4]} />
      <meshStandardMaterial color={new THREE.Color("#b35f45")} />
    </mesh>
  );
};

export default React.memo(Roof);
