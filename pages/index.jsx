import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";

export default function Texture() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <mesh>
          <boxGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}
