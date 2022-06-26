import React from "react";

const Graves = () => {
  return (
    <group>
      {new Array(50).fill(null).map((_, index) => {
        const angle = Math.random() * Math.PI * 2; // Random angle
        const radius = 3 + Math.random() * 6; // Random radius
        const x = Math.cos(angle) * radius; // Get the x position using cosinus
        const z = Math.sin(angle) * radius;

        const rotateZ = (Math.random() - 0.5) * 0.4;
        const rotateY = (Math.random() - 0.5) * 0.4;
        return (
          <mesh
            position={[x, 0.3, z]}
            rotation={[0, rotateY, rotateZ]}
            key={index}
            castShadow={true}
          >
            <boxBufferGeometry args={[0.6, 0.8, 0.1]} />
            <meshStandardMaterial color="#727272" />
          </mesh>
        );
      })}
    </group>
  );
};

export default React.memo(Graves);
