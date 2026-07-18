import type { ThreeEvent } from "@react-three/fiber";
import { destinationOrder, destinations } from "../data/destinations";
import { usePortfolioStore } from "../store/usePortfolioStore";

export function DestinationMarkers() {
  const selectedDestination = usePortfolioStore(
    (state) => state.destination,
  );
  const travelTo = usePortfolioStore((state) => state.travelTo);

  return (
    <>
      {destinationOrder.map((key) => {
        const destination = destinations[key];
        const selected = selectedDestination === key;

        return (
          <group
            key={key}
            position={destination.position}
            onClick={(event: ThreeEvent<MouseEvent>) => {
              event.stopPropagation();
              travelTo(key);
            }}
          >
            <mesh receiveShadow position={[0, 0.08, 0]}>
              <cylinderGeometry args={[1.15, 1.35, 0.16, 32]} />
              <meshStandardMaterial
                color={selected ? "#1a6484" : "#15233d"}
                metalness={0.45}
                roughness={0.35}
                emissive={selected ? "#36d5ff" : "#07111f"}
                emissiveIntensity={selected ? 0.7 : 0.15}
              />
            </mesh>

            <mesh position={[0, 0.22, 0]}>
              <torusGeometry args={[0.82, 0.035, 12, 48]} />
              <meshStandardMaterial
                color={selected ? "#8deeff" : "#547090"}
                emissive={selected ? "#4fd8ff" : "#101827"}
                emissiveIntensity={selected ? 2 : 0.3}
              />
            </mesh>
          </group>
        );
      })}
    </>
  );
}
