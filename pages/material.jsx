import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { Canvas } from "@react-three/fiber";

export default function Material() {
  return (
    <div className="w-full h-screen">
      <Canvas>
        <mesh>
          <torusGeometry />
          <meshStandardMaterial />
        </mesh>
      </Canvas>
    </div>
  );
}
