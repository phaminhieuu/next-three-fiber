import { Reflector, useTexture } from "@react-three/drei";
import { HPI } from "../../constants/analyser";

export default function Ground() {
    const [floor, normal] = useTexture([
      "/analyser/SurfaceImperfections003_1K_var1.jpg",
      "/analyser/SurfaceImperfections003_1K_Normal.jpg",
    ]);
    return (
      <Reflector
        position={[0, -0.225, 0]}
        resolution={512}
        args={[10, 10]}
        mirror={0.5}
        mixBlur={7}
        mixStrength={0.8}
        rotation={[-HPI, 0, HPI]}
        blur={[400, 50]}
      >
        {(Material, props) => (
          <Material
            color="#858585"
            metalness={0.5}
            roughnessMap={floor}
            normalMap={normal}
            normalScale={[0.1, 0.1]}
            {...props}
          />
        )}
      </Reflector>
    );
  }