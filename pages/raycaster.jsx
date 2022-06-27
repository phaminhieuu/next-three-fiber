import { OrbitControls } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  Suspense,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import Loader from "../components/loader";
import * as THREE from "three";
import { MouseContext } from "../context/MouseObserver";

function Scene() {
  const { mouseX, mouseY } = useContext(MouseContext);

  const [rayOrigin] = useState(() => new THREE.Vector3(-3, 0, 0));
  const [rayDirection] = useState(() =>
    new THREE.Vector3(10, 0, 0).normalize()
  );
  // const [mouse] = useState(() => new THREE.Vector2());

  const sphere1 = useRef();
  const sphere2 = useRef();
  const sphere3 = useRef();

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    sphere1.current.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    sphere2.current.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    sphere3.current.position.y = Math.sin(elapsedTime * 1.4) * 1.5;
  });

  return (
    <>
      <mesh position={[-2, 0, 0]} ref={sphere1}>
        <sphereBufferGeometry args={[0.5, 16, 16]} />
        <meshNormalMaterial />
      </mesh>
      <mesh ref={sphere2}>
        <sphereBufferGeometry args={[0.5, 16, 16]} />
        <meshNormalMaterial />
      </mesh>
      <mesh position={[2, 0, 0]} ref={sphere3}>
        <sphereBufferGeometry args={[0.5, 16, 16]} />
        <meshNormalMaterial />
      </mesh>

      <raycaster set={{ rayDirection, rayOrigin }} />
    </>
  );
}

export default function Raycaster() {
  const mouse = useRef([0, 0]);
  const onMouseMove = useCallback(
    ({ clientX: x, clientY: y }) => {
      mouse.current = [
        (x / window.innerWidth) * 2 - 1,
        -(y / window.innerHeight) * 2 + 1,
      ];
    },

    []
  );

  console.log(mouse.current);
  return (
    <div className="w-full h-screen">
      <Canvas
        onMouseMove={onMouseMove}
        camera={{ position: [0, 0, 3], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        legacy={true}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
