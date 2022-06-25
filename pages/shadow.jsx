import { OrbitControls, useHelper, useTexture } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import React, {
  Suspense,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Loader from "../components/loader";
import { useControls } from "leva";
import * as THREE from "three";
import {
  DirectionalLightHelper,
  PointLightHelper,
  SpotLightHelper,
} from "three";

function Scene() {
  const [planePosition, setPlanePosition] = useState(new THREE.Vector3());
  const [spherePosition, setSpherePosition] = useState(new THREE.Vector3());

  const { ambientIntensity, directionIntensity, x, y, z } = useControls({
    ambientIntensity: { value: 0.3, min: 0, max: 1, step: 0.001 },
    directionIntensity: { value: 0.3, min: 0, max: 1, step: 0.001 },
    x: { value: 2, min: -5, max: 5, step: 0.001 },
    y: { value: 2, min: -5, max: 5, step: 0.001 },
    z: { value: -1, min: -5, max: 5, step: 0.001 },
  });

  const directRef = useRef();
  const spotRef = useRef();
  const pointRef = useRef();

  const planeRef = useRef();
  const shadowRef = useRef();
  const sphereRef = useRef();
  //textures
  const props = useTexture({
    alphaMap: "/textures/shadow/simpleShadow.jpg",
  });

  //Light helper
  //   useHelper(directRef, DirectionalLightHelper);
  //   useHelper(spotRef, SpotLightHelper);
  //   useHelper(pointRef, PointLightHelper);

  useEffect(() => {
    if (!planeRef.current && !sphereRef.current) return;
    setPlanePosition(planeRef.current.position);
    setSpherePosition(sphereRef.current.position);
  }, [planeRef.current, sphereRef.current]);

  useLayoutEffect(() => {
    if (!directRef.current || !spotRef.current) return;

    //Directional Light
    const directShadow = directRef.current.shadow;
    directShadow.mapSize.width = 1024;
    directShadow.mapSize.height = 1024;
    directShadow.camera.near = 1;
    directShadow.camera.far = 6;
    directShadow.camera.top = 2;
    directShadow.camera.right = 2;
    directShadow.camera.bottom = -2;
    directShadow.camera.left = -2;

    //SpotLight
    const spotShadow = spotRef.current.shadow;
    spotShadow.mapSize.width = 1024;
    spotShadow.mapSize.height = 1024;
    spotShadow.camera.near = 1;
    spotShadow.camera.far = 6;
    spotShadow.camera.fov = 30;

    //PointLight
    const pointShadow = pointRef.current.shadow;
    pointShadow.mapSize.width = 1024;
    pointShadow.mapSize.height = 1024;
    pointShadow.camera.near = 0.1;
    pointShadow.camera.far = 5;
  }, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    // Update the sphere
    sphereRef.current.position.x = Math.cos(elapsedTime) * 1.5;
    sphereRef.current.position.z = Math.sin(elapsedTime) * 1.5;
    sphereRef.current.position.y = Math.abs(Math.sin(elapsedTime * 3));

    // Update the shadow
    shadowRef.current.position.x = spherePosition.x;
    shadowRef.current.position.z = spherePosition.z;
    shadowRef.current.material.opacity = (1 - Math.abs(spherePosition.y)) * 0.3;
  });

  return (
    <>
      <ambientLight
        intensity={ambientIntensity}
        color={new THREE.Color(0xffffff)}
      />
      <directionalLight
        position={[x, y, z]}
        ref={directRef}
        color={new THREE.Color(0xffffff)}
        intensity={directionIntensity}
        castShadow={true}
      />

      <spotLight
        position={[0, 2, 2]}
        ref={spotRef}
        args={[new THREE.Color(0xffffff), 0.3, 10, Math.PI * 0.3]}
        castShadow={true}
      />

      <pointLight
        ref={pointRef}
        position={[-1, 1, 0]}
        args={[new THREE.Color(0xffffff), 0.3]}
        castShadow={true}
      />

      <mesh castShadow={true} ref={sphereRef}>
        <sphereBufferGeometry args={[0.5, 32, 32]} />
        <meshStandardMaterial roughness={0.7} />
      </mesh>

      <mesh
        ref={shadowRef}
        rotation={[-Math.PI * 0.5, 0, 0]}
        position={[0, planePosition.y + 0.01, 0]}
      >
        <planeBufferGeometry args={[1.5, 1.5]} />
        <meshBasicMaterial
          color={new THREE.Color(0x000000)}
          transparent={true}
          {...props}
        />
      </mesh>

      <mesh
        ref={planeRef}
        position={[0, -0.5, 0]}
        rotation={[-Math.PI * 0.5, 0, 0]}
        receiveShadow={true}
      >
        <planeBufferGeometry args={[5, 5]} />
        <meshStandardMaterial roughness={0.7} />
      </mesh>
    </>
  );
}

export default function Shadow() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [1, 1, 2], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        flat={true}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
