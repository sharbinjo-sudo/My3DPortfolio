import { useMemo } from "react";
import * as THREE from "three";
import {
  destinations,
  type DestinationKey,
} from "../data/destinations";

const connections: Array<
  readonly [DestinationKey, DestinationKey]
> = [
  ["home", "about"],
  ["home", "skills"],
  ["about", "experience"],
  ["skills", "projects"],
  ["experience", "contact"],
  ["projects", "contact"],
  ["home", "contact"],
];

interface PathSegmentProps {
  from: readonly [number, number, number];
  to: readonly [number, number, number];
}

function PathSegment({ from, to }: PathSegmentProps) {
  const path = useMemo(() => {
    const start = new THREE.Vector3(...from);
    const end = new THREE.Vector3(...to);
    const midpoint = start.clone().add(end).multiplyScalar(0.5);
    const direction = end.clone().sub(start);
    const length = direction.length();
    const rotationY = Math.atan2(direction.x, direction.z);

    return { midpoint, length, rotationY };
  }, [from, to]);

  return (
    <mesh
      position={[path.midpoint.x, 0.025, path.midpoint.z]}
      rotation={[0, path.rotationY, 0]}
      receiveShadow
    >
      <boxGeometry args={[0.18, 0.035, path.length]} />
      <meshStandardMaterial
        color="#234e70"
        emissive="#1aa8d2"
        emissiveIntensity={0.45}
        metalness={0.25}
        roughness={0.45}
      />
    </mesh>
  );
}

export function NavigationPaths() {
  return (
    <>
      {connections.map(([fromKey, toKey]) => (
        <PathSegment
          key={`${fromKey}-${toKey}`}
          from={destinations[fromKey].position}
          to={destinations[toKey].position}
        />
      ))}
    </>
  );
}
