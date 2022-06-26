import React from "react";

const Bush = ({ scale, x, y, z }) => {
  return (
    <mesh position={[x, y, z]} scale={[scale, scale, scale]} castShadow={true}>
      <sphereBufferGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#89c854" />
    </mesh>
  );
};

const Bushes = () => {
  return (
    <>
      <Bush scale={0.5} x={0.8} y={0.2} z={2.2} />
      <Bush scale={0.25} x={1.4} y={0.1} z={2.1} />
      <Bush scale={0.4} x={-0.8} y={0.1} z={2.2} />
      <Bush scale={0.15} x={-1} y={0.05} z={2.6} />
    </>
  );
};

export default React.memo(Bushes);
