import { Canvas } from "@react-three/fiber";
import { Suspense, useRef } from "react";
import * as THREE from "three";
import { BasicWorld } from "./BasicWorld";
import { CameraRig } from "./CameraRig";
import { CharacterController } from "./CharacterController";

export function PortfolioCanvas() {
  const characterRef = useRef<THREE.Group>(null);

  return (
    <Canvas
      shadows
      dpr={[1, 1.5]}
      camera={{
        position: [0, 8, 12],
        fov: 48,
        near: 0.1,
        far: 120,
      }}
      gl={{
        antialias: true,
        powerPreference: "high-performance",
      }}
    >
      <BasicWorld />

      <Suspense fallback={null}>
        <CharacterController
          characterRef={characterRef}
        />
      </Suspense>

      <CameraRig characterRef={characterRef} />
    </Canvas>
  );
}