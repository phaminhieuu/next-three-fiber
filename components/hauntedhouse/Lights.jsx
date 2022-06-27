/* eslint-disable react/display-name */
import { useFrame } from "@react-three/fiber";
import React, { useLayoutEffect, useRef } from "react";
import * as THREE from "three";

const GhostLight = React.forwardRef((props, ref) => {
  const { color } = props;

  const ghostRef = useRef();
  useLayoutEffect(() => {
    if (!ghostRef.current) return;
    ghostRef.current.shadow.mapSize.width = 256;
    ghostRef.current.shadow.mapSize.height = 256;
    ghostRef.current.camera.far = 7;
  }, []);
  return <pointLight ref={ref} args={[color, 3, 3]} castShadow={true} />;
});

const Lights = () => {
  const ghost1 = useRef();
  const ghost2 = useRef();
  const ghost3 = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // Ghosts
    const ghost1Angle = elapsedTime * 0.5;
    ghost1.current.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.current.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.current.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.32;
    ghost2.current.position.x = Math.cos(ghost2Angle) * 5;
    ghost2.current.position.z = Math.sin(ghost2Angle) * 5;
    ghost2.current.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.18;
    ghost3.current.position.x =
      Math.cos(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.32));
    ghost3.current.position.z =
      Math.sin(ghost3Angle) * (7 + Math.sin(elapsedTime * 0.5));
    ghost3.current.position.y =
      Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);
  });

  const directRef = useRef();
  const pointRef = useRef();

  useLayoutEffect(() => {
    if (!directRef.current || !!pointRef.current) return;
    directRef.current.shadow.mapSize.width = 256;
    directRef.current.shadow.mapSize.height = 256;
    directRef.current.shadow.camera.far = 15;

    pointRef.current.shadow.mapSize.width = 256;
    pointRef.current.shadow.mapSize.height = 256;
    pointRef.current.shadow.camera.far = 7;
  }, []);

  return (
    <>
      <ambientLight color={new THREE.Color("#b9d5ff")} intensity={0.3} />

      {/* Moon light */}
      <directionalLight
        color={new THREE.Color("#b9d5ff")}
        intensity={0.12}
        castShadow={true}
        position={[4, 5, -2]}
      />

      {/* Door light */}
      <pointLight
        args={["#ff7d46", 1, 7]}
        castShadow={true}
        position={[0, 2.2, 2.7]}
      />

      {/* Ghost */}
      {/* ====Ghost 1==== */}
      <GhostLight ref={ghost1} color="#ff00ff" />
      <GhostLight ref={ghost2} color="#00ffff" />
      <GhostLight ref={ghost3} color="#ff7800" />
    </>
  );
};

export default React.memo(Lights);
