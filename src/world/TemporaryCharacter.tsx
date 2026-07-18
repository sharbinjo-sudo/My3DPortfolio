import { useFrame } from "@react-three/fiber";
import {
  type RefObject,
  useEffect,
  useMemo,
  useRef,
} from "react";
import * as THREE from "three";
import {
  destinations,
  type DestinationKey,
} from "../data/destinations";
import { usePortfolioStore } from "../store/usePortfolioStore";

interface TemporaryCharacterProps {
  characterRef: RefObject<THREE.Group | null>;
}

const WALK_SPEED = 3.4;
const ARRIVAL_DISTANCE = 0.08;

export function TemporaryCharacter({
  characterRef,
}: TemporaryCharacterProps) {
  const visualRef = useRef<THREE.Group>(null);
  const destination = usePortfolioStore((state) => state.destination);
  const arriveAt = usePortfolioStore((state) => state.arriveAt);
  const target = useMemo(() => new THREE.Vector3(), []);
  const direction = useMemo(() => new THREE.Vector3(), []);
  const notifiedDestination = useRef<DestinationKey | null>("home");

  useEffect(() => {
    notifiedDestination.current = null;
  }, [destination]);

  useFrame((state, delta) => {
    const character = characterRef.current;
    const visual = visualRef.current;

    if (!character || !visual) {
      return;
    }

    target.fromArray(destinations[destination].position);
    direction.subVectors(target, character.position);
    const distance = direction.length();

    if (distance > ARRIVAL_DISTANCE) {
      direction.normalize();

      const step = Math.min(WALK_SPEED * delta, distance);
      character.position.addScaledVector(direction, step);

      const targetRotation = Math.atan2(direction.x, direction.z);
      character.rotation.y = THREE.MathUtils.damp(
        character.rotation.y,
        targetRotation,
        10,
        delta,
      );

      visual.position.y =
        0.55 + Math.abs(Math.sin(state.clock.elapsedTime * 9)) * 0.07;
      visual.rotation.z =
        Math.sin(state.clock.elapsedTime * 9) * 0.025;
      return;
    }

    character.position.copy(target);
    visual.position.y = THREE.MathUtils.damp(
      visual.position.y,
      0.55,
      8,
      delta,
    );
    visual.rotation.z = THREE.MathUtils.damp(
      visual.rotation.z,
      0,
      8,
      delta,
    );

    if (notifiedDestination.current !== destination) {
      arriveAt(destination);
      notifiedDestination.current = destination;
    }
  });

  return (
    <group ref={characterRef} position={[0, 0, 0]}>
      <group ref={visualRef} position={[0, 0.55, 0]}>
        <mesh castShadow position={[0, 0.6, 0]}>
          <capsuleGeometry args={[0.32, 0.7, 8, 16]} />
          <meshStandardMaterial
            color="#68e7ff"
            metalness={0.35}
            roughness={0.3}
          />
        </mesh>

        <mesh castShadow position={[0, 1.35, 0]}>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color="#dbeafe" roughness={0.55} />
        </mesh>

        <mesh position={[0, 1.36, 0.285]}>
          <boxGeometry args={[0.34, 0.12, 0.04]} />
          <meshStandardMaterial
            color="#07111f"
            emissive="#4fd8ff"
            emissiveIntensity={1.8}
          />
        </mesh>

        <mesh castShadow position={[-0.42, 0.62, 0]}>
          <capsuleGeometry args={[0.09, 0.48, 6, 12]} />
          <meshStandardMaterial color="#233b63" />
        </mesh>

        <mesh castShadow position={[0.42, 0.62, 0]}>
          <capsuleGeometry args={[0.09, 0.48, 6, 12]} />
          <meshStandardMaterial color="#233b63" />
        </mesh>

        <mesh castShadow position={[-0.18, -0.05, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 6, 12]} />
          <meshStandardMaterial color="#15233d" />
        </mesh>

        <mesh castShadow position={[0.18, -0.05, 0]}>
          <capsuleGeometry args={[0.1, 0.5, 6, 12]} />
          <meshStandardMaterial color="#15233d" />
        </mesh>
      </group>
    </group>
  );
}
