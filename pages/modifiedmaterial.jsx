import {
  OrbitControls,
  useCubeTexture,
  useGLTF,
  useTexture,
} from "@react-three/drei";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import React, {
  Suspense,
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Loader from "../components/loader";
import * as THREE from "three";
import { useControls } from "leva";

function Environment() {
  const { scene } = useThree();
  const envMap = new useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    { path: "/textures/environment/3/" }
  );

  useEffect(() => {
    envMap.encoding = THREE.sRGBEncoding;
    scene.environment = envMap;
    scene.background = envMap;
  }, []);

  return null;
}

function Model() {
  const [depthMaterial] = useState(
    () =>
      new THREE.MeshDepthMaterial({
        depthPacking: THREE.RGBADepthPacking,
      })
  );

  const sceneCanvas = useThree().scene;
  const group = useRef();
  const mesh = useRef();
  const materialRef = useRef();
  const { nodes } = useGLTF("/models/LeePerrySmith/LeePerrySmith.glb");

  const customUniforms = {
    uTime: { value: 0 },
  };

  const [map, normal] = new useTexture([
    "/models/LeePerrySmith/color.jpg",
    "/models/LeePerrySmith/normal.jpg",
  ]);

  map.encoding = THREE.sRGBEncoding;

  useLayoutEffect(() => {
    sceneCanvas.traverse((child) => {
      if (
        child instanceof THREE.Mesh &&
        child.material instanceof THREE.MeshStandardMaterial
      ) {
        // child.material.envMap = environmentMap
        child.material.envMapIntensity = 5;
        child.material.needsUpdate = true;
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
  }, []);

  useLayoutEffect(() => {
    if (!mesh.current || !materialRef.current) return;
    mesh.current.customDepthMaterial = depthMaterial;

    const material = materialRef.current;
    material.map = map;
    material.normalMap = normal;

    material.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime;

      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
      );

      shader.vertexShader = shader.vertexShader.replace(
        "#include <beginnormal_vertex>",
        `
            #include <beginnormal_vertex>

            float angle = (sin(position.y + uTime)) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            objectNormal.xz = objectNormal.xz * rotateMatrix;
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
            #include <begin_vertex>

            transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };
    depthMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = customUniforms.uTime;
      shader.vertexShader = shader.vertexShader.replace(
        "#include <common>",
        `
            #include <common>

            uniform float uTime;

            mat2 get2dRotateMatrix(float _angle)
            {
                return mat2(cos(_angle), - sin(_angle), sin(_angle), cos(_angle));
            }
        `
      );
      shader.vertexShader = shader.vertexShader.replace(
        "#include <begin_vertex>",
        `
            #include <begin_vertex>

            float angle = (sin(position.y + uTime)) * 0.4;
            mat2 rotateMatrix = get2dRotateMatrix(angle);

            transformed.xz = rotateMatrix * transformed.xz;
        `
      );
    };
  }, []);

  useFrame(({ clock }) => {
    const elapsedTime = clock.getElapsedTime();
    customUniforms.uTime.value = elapsedTime;

    // material.uniforms.uTime.value = elapsedTime;
  });

  return (
    <>
      {/* <mesh
        position={[0, -5, 5]}
        rotation={[0, Math.PI, 0]}
        castShadow
        receiveShadow
      >
        <planeBufferGeometry args={[15, 15, 15]} />
        <meshStandardMaterial />
      </mesh> */}
      <group
        ref={group}
        rotation={[0, Math.PI * 0.5, 0]}
        castShadow
        receiveShadow
      >
        <mesh ref={mesh}>
          <primitive
            object={nodes["LeePerrySmith"].geometry}
            attach="geometry"
          />
          <primitive
            object={nodes["LeePerrySmith"].material}
            attach="material"
            ref={materialRef}
          />
        </mesh>
      </group>
    </>
  );
}

useGLTF.preload("/models/LeePerrySmith/LeePerrySmith.glb");

function Scene() {
  const directRef = useRef();
  useLayoutEffect(() => {
    if (!directRef.current) return;
    const shadow = directRef.current.shadow;
    shadow.camera.far = 15;
    shadow.mapSize.set(1024, 1024);
    shadow.normalBias = 0.05;
  }, []);

  return (
    <>
      <directionalLight
        ref={directRef}
        args={["#ffffff", 3]}
        castShadow={true}
        position={[0.25, 2, -2.25]}
      />
      <Model />
    </>
  );
}

export default function ModifiedMaterial() {
  return (
    <div className="w-full h-screen">
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [4, 1, -4], fov: 75, near: 0.1, far: 100 }}
        linear
        legacy
        flat
        shadows={{ type: THREE.PCFShadowMap, enabled: true }}
        gl={{
          physicallyCorrectLights: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1,
          antialias: true,
          outputEncoding: THREE.sRGBEncoding,
        }}
      >
        <Suspense fallback={<Loader />}>
          <Scene />
          <Environment />
          <OrbitControls />
        </Suspense>
      </Canvas>
    </div>
  );
}
