import { useFrame } from "@react-three/fiber";
import { type RefObject, useMemo } from "react";
import * as THREE from "three";

interface CameraRigProps {
  characterRef: RefObject<THREE.Group | null>;
}

export function CameraRig({ characterRef }: CameraRigProps) {
  const desiredPosition = useMemo(() => new THREE.Vector3(), []);
  const lookAtPosition = useMemo(() => new THREE.Vector3(), []);
  const cameraOffset = useMemo(
    () => new THREE.Vector3(0, 5.3, 8.2),
    [],
  );

  useFrame(({ camera }, delta) => {
    const character = characterRef.current;

    if (!character) {
      return;
    }

    desiredPosition.copy(character.position).add(cameraOffset);

    const smoothing = 1 - Math.exp(-3.5 * delta);
    camera.position.lerp(desiredPosition, smoothing);

    lookAtPosition.copy(character.position);
    lookAtPosition.y += 0.8;
    camera.lookAt(lookAtPosition);
  });

  return null;
}
