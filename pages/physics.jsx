import { OrbitControls, useCubeTexture, useTexture } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import React, {
  Suspense,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Loader from "../components/loader";
import * as THREE from "three";
import { Physics, usePlane, useBox, useSphere } from "@react-three/cannon";

function Box({ envMap, playHitSound }) {
  const values = useMemo(() => {
    const w = Math.random();
    const h = Math.random();
    const d = Math.random();

    const x = (Math.random() - 0.5) * 3;
    const y = 3;
    const z = (Math.random() - 0.5) * 3;
    return { w, h, d, x, y, z };
  }, []);

  const [boxRef] = useBox(() => ({
    mass: 1,
    position: [values.x, values.y, values.z],
    rotation: [values.w, values.h, values.d],
    args: [values.w, values.h, values.d],
    onCollide: (e) => playHitSound(e),
  }));

  return (
    <mesh ref={boxRef} castShadow={true}>
      <boxBufferGeometry args={[values.w, values.h, values.d]} />
      <meshStandardMaterial metalness={0.3} roughness={0.4} envMap={envMap} />
    </mesh>
  );
}

function Sphere({ envMap, playHitSound }) {
  const values = useMemo(() => {
    const r = Math.random() * 0.5;
    const x = (Math.random() - 0.5) * 3;
    const y = 3;
    const z = (Math.random() - 0.5) * 3;
    return { r, x, y, z };
  }, []);

  const [sphereRef] = useSphere(() => ({
    mass: 1,
    position: [values.x, values.y, values.z],
    args: [values.r], 
    onCollide: (e) => playHitSound(e),
  }));
  return (
    <mesh ref={sphereRef} castShadow={true}>
      <sphereBufferGeometry args={[values.r, 20, 20]} />
      <meshStandardMaterial metalness={0.3} roughness={0.4} envMap={envMap} />
    </mesh>
  );
}

function Scene({ boxes, spheres, playHitSound }) {
  const [planeRef] = usePlane(() => ({
    rotation: [-Math.PI * 0.5, 0, 0],
    mass: 0,
    // quaternion: [-1, 0, 0, Math.PI * 0.5],
  }));

  const envMap = useCubeTexture(
    ["px.jpg", "nx.jpg", "py.jpg", "ny.jpg", "pz.jpg", "nz.jpg"],
    { path: "/textures/environment/0/" }
  );

  const directRef = useRef();

  useLayoutEffect(() => {
    if (!directRef.current) return;
    const camera = directRef.current.shadow.camera;
    directRef.current.shadow.mapSize = new THREE.Vector2(1024, 1024);
    camera.far = 15;
    camera.left = -7;
    camera.top = 7;
    camera.right = 7;
    camera.bottom = -7;
  }, []);

  return (
    <>
      <ambientLight color={new THREE.Color(0xffffff)} intensity={0.7} />
      <directionalLight
        ref={directRef}
        position={[5, 5, 5]}
        color={new THREE.Color(0xffffff)}
        intensity={0.2}
        castShadow={true}
      />
      <mesh ref={planeRef} receiveShadow={true}>
        <planeBufferGeometry args={[10, 10]} attach="geometry" />
        <meshStandardMaterial
          attach="material"
          color="#777777"
          metalness={0.3}
          roughness={0.4}
          envMap={envMap}
        />
      </mesh>
      {new Array(boxes).fill(null).map((_, index) => (
        <Box envMap={envMap} key={index} playHitSound={playHitSound} />
      ))}
      {new Array(spheres).fill(null).map((_, index) => (
        <Sphere envMap={envMap} key={index} playHitSound={playHitSound} />
      ))}
    </>
  );
}

export default function Physics3D() {
  const [boxes, setBoxes] = useState(1);
  const [spheres, setSpheres] = useState(0);
  // const hitSound = new Audio("/sounds/hit.mp3");
  const sound = useRef(
    typeof Audio !== "undefined" ? new Audio("/sounds/hit.mp3") : undefined
  );

  const playHitSound = (collision) => {
    const impactStrength = collision.contact.impactVelocity;

    const hitSound = sound.current;

    if (impactStrength > 1.5) {
      hitSound.volume = Math.random();
      hitSound.currentTime = 0;
      hitSound.play();
    }
  };

  return (
    <div className="w-full h-screen">
      <div className="fixed top-0 right-0 z-[1000] text-white bg-stone-700 flex flex-col justify-start w-1/7 gap-2 p-2">
        <button onClick={() => setBoxes(boxes + 1)}>Create box</button>
        <button onClick={() => setSpheres(spheres + 1)}>Create sphere</button>
        <button
          onClick={() => {
            setBoxes(0);
            setSpheres(0);
          }}
        >
          Reset
        </button>
      </div>
      <Canvas
        shadows={true}
        camera={{ position: [-3, 3, 3], fov: 75, near: 0.1, far: 100 }}
        linear={true}
        legacy={true}
        flat={true}
        // sRGB
        // gl={{ alpha: false }}
        // shadows={true}
      >
        <Physics
          broadphase="SAP"
          allowSleep
          gravity={[0, -9.82, 0]}
          defaultContactMaterial={{ friction: 0.1, restitution: 0.7 }}
        >
          <Suspense fallback={<Loader />}>
            <Scene
              boxes={boxes}
              spheres={spheres}
              playHitSound={playHitSound}
            />
            <OrbitControls />
          </Suspense>
        </Physics>
      </Canvas>
    </div>
  );
}
