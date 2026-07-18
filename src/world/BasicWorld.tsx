import { Html } from "@react-three/drei";
import type { ThreeEvent } from "@react-three/fiber";
import { useMemo } from "react";
import * as THREE from "three";
import {
  destinationOrder,
  destinations,
  type DestinationKey,
} from "../data/destinations";
import { usePortfolioStore } from "../store/usePortfolioStore";

interface LandmarkStyle {
  buildingColor: string;
  accentColor: string;
  height: number;
}

const landmarkStyles: Record<
  DestinationKey,
  LandmarkStyle
> = {
  home: {
    buildingColor: "#173956",
    accentColor: "#66dcff",
    height: 1.7,
  },
  about: {
    buildingColor: "#24375b",
    accentColor: "#8aa9ff",
    height: 1.9,
  },
  skills: {
    buildingColor: "#163f48",
    accentColor: "#5effd2",
    height: 2.1,
  },
  experience: {
    buildingColor: "#49391f",
    accentColor: "#ffd166",
    height: 2.4,
  },
  projects: {
    buildingColor: "#41264f",
    accentColor: "#d58aff",
    height: 2.2,
  },
  contact: {
    buildingColor: "#4b2438",
    accentColor: "#ff82ad",
    height: 2.6,
  },
};

interface RoadProps {
  from: readonly [number, number, number];
  to: readonly [number, number, number];
}

function Road({ from, to }: RoadProps) {
  const road = useMemo(() => {
    const start = new THREE.Vector3(
      from[0],
      0,
      from[2],
    );

    const end = new THREE.Vector3(
      to[0],
      0,
      to[2],
    );

    const middle = start
      .clone()
      .add(end)
      .multiplyScalar(0.5);

    const length = start.distanceTo(end);

    const deltaX = end.x - start.x;
    const deltaZ = end.z - start.z;

    const rotationY = -Math.atan2(
      deltaZ,
      deltaX,
    );

    return {
      middle,
      length,
      rotationY,
    };
  }, [from, to]);

  return (
    <group>
      <mesh
        position={[
          road.middle.x,
          0.035,
          road.middle.z,
        ]}
        rotation={[0, road.rotationY, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[road.length, 0.06, 0.9]}
        />

        <meshStandardMaterial
          color="#102d43"
          roughness={0.65}
          metalness={0.15}
        />
      </mesh>

      <mesh
        position={[
          road.middle.x,
          0.072,
          road.middle.z,
        ]}
        rotation={[0, road.rotationY, 0]}
      >
        <boxGeometry
          args={[road.length, 0.015, 0.08]}
        />

        <meshStandardMaterial
          color="#34c8ff"
          emissive="#127aa8"
          emissiveIntensity={1.4}
        />
      </mesh>
    </group>
  );
}

interface LandmarkProps {
  destinationKey: DestinationKey;
}

function Landmark({
  destinationKey,
}: LandmarkProps) {
  const destination =
    destinations[destinationKey];

  const style =
    landmarkStyles[destinationKey];

  const selectedDestination =
    usePortfolioStore(
      (state) => state.destination,
    );

  const activeSection = usePortfolioStore((state) => state.activeSection);
  const characterStatus = usePortfolioStore((state) => state.characterStatus);
  const travelTo = usePortfolioStore((state) => state.travelTo);
  const openPanel = usePortfolioStore((state) => state.openPanel);
  const experienceMode = usePortfolioStore((state) => state.experienceMode);
  const nearbySection = usePortfolioStore((state) => state.nearbySection);

  const isTravelling =
    characterStatus === "walking" ||
    characterStatus === "running";

  const isSelected =
    selectedDestination === destinationKey;

  const isCharacterHere =
    experienceMode === "explore"
      ? nearbySection === destinationKey
      : activeSection === destinationKey && !isTravelling;

  const handleClick = () => {
    if (experienceMode === "explore") {
      if (isCharacterHere) {
        openPanel();
      }

      return;
    }

    if (isCharacterHere) {
      openPanel();
      return;
    }

    travelTo(destinationKey);
  };
  const handleObjectClick = (
    event: ThreeEvent<MouseEvent>,
  ) => {
    event.stopPropagation();
    handleClick();
  };

  const handlePointerOver = (
    event: ThreeEvent<PointerEvent>,
  ) => {
    event.stopPropagation();
    document.body.style.cursor = "pointer";
  };

  const handlePointerOut = () => {
    document.body.style.cursor = "default";
  };

  const locationMessage = isCharacterHere
    ? "Click for details"
    : experienceMode === "explore"
      ? "Walk closer"
      : isTravelling
        ? "Click to redirect"
        : "Click to travel";

  return (
    <group
      position={[
        destination.position[0],
        destination.position[1],
        destination.position[2],
      ]}
    >
      {/* Landing platform */}
      <mesh
        position={[0, 0.05, 0]}
        receiveShadow
        onClick={handleObjectClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <cylinderGeometry
          args={[1.35, 1.5, 0.1, 32]}
        />

        <meshStandardMaterial
          color={
            isSelected
              ? style.accentColor
              : "#15324a"
          }
          emissive={
            isSelected
              ? style.accentColor
              : "#071725"
          }
          emissiveIntensity={
            isSelected ? 0.55 : 0.15
          }
          roughness={0.55}
          metalness={0.35}
        />
      </mesh>

      {/* Landing ring */}
      <mesh
        position={[0, 0.12, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onClick={handleObjectClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <ringGeometry
          args={[1.02, 1.14, 32]}
        />

        <meshStandardMaterial
          color={style.accentColor}
          emissive={style.accentColor}
          emissiveIntensity={1.2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Building */}
      <group position={[0, 0, -1.8]}>
        <mesh
          position={[
            0,
            style.height / 2,
            0,
          ]}
          castShadow
          receiveShadow
          onClick={handleObjectClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry
            args={[
              1.8,
              style.height,
              1.5,
            ]}
          />

          <meshStandardMaterial
            color={style.buildingColor}
            roughness={0.42}
            metalness={0.35}
          />
        </mesh>

        {/* Roof */}
        <mesh
          position={[
            0,
            style.height + 0.28,
            0,
          ]}
          castShadow
          onClick={handleObjectClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <coneGeometry
            args={[1.25, 0.58, 4]}
          />

          <meshStandardMaterial
            color={style.accentColor}
            emissive={style.accentColor}
            emissiveIntensity={0.35}
            roughness={0.4}
            metalness={0.45}
          />
        </mesh>

        {/* Glowing door */}
        <mesh
          position={[0, 0.48, 0.756]}
          onClick={handleObjectClick}
          onPointerOver={handlePointerOver}
          onPointerOut={handlePointerOut}
        >
          <boxGeometry
            args={[0.58, 0.95, 0.035]}
          />

          <meshStandardMaterial
            color={style.accentColor}
            emissive={style.accentColor}
            emissiveIntensity={1}
          />
        </mesh>
      </group>

      {/* Floating label */}
      <Html
        position={[
          0,
          style.height + 1.15,
          -1.8,
        ]}
        center
        distanceFactor={11}
        style={{
          pointerEvents: "none",
        }}
      >
        <div
          className={
            isSelected
              ? "world-location-label active"
              : "world-location-label"
          }
        >
          <strong>
            {destination.label}
          </strong>

          <span>
            {locationMessage}
          </span>
        </div>
      </Html>
    </group>
  );
}

interface TreeProps {
  position: [number, number, number];
  scale?: number;
}

function Tree({
  position,
  scale = 1,
}: TreeProps) {
  return (
    <group
      position={position}
      scale={scale}
    >
      <mesh
        position={[0, 0.55, 0]}
        castShadow
      >
        <cylinderGeometry
          args={[0.12, 0.17, 1.1, 8]}
        />

        <meshStandardMaterial
          color="#49311e"
        />
      </mesh>

      <mesh
        position={[0, 1.35, 0]}
        castShadow
      >
        <coneGeometry
          args={[0.72, 1.55, 8]}
        />

        <meshStandardMaterial
          color="#17634e"
          roughness={0.8}
        />
      </mesh>
    </group>
  );
}

const treePositions: Array<{
  position: [number, number, number];
  scale: number;
}> = [
  {
    position: [-12, 0, -7],
    scale: 1.1,
  },
  {
    position: [-10, 0, 8],
    scale: 0.9,
  },
  {
    position: [-6, 0, -11],
    scale: 1.2,
  },
  {
    position: [-2, 0, 10],
    scale: 0.85,
  },
  {
    position: [4, 0, -10],
    scale: 1,
  },
  {
    position: [8, 0, 9],
    scale: 1.15,
  },
  {
    position: [12, 0, -5],
    scale: 0.95,
  },
  {
    position: [14, 0, 6],
    scale: 1.1,
  },
  {
    position: [-15, 0, 2],
    scale: 0.8,
  },
  {
    position: [16, 0, 1],
    scale: 0.9,
  },
];

export function BasicWorld() {
  const homePosition =
    destinations.home.position;

  return (
    <>
      <color
        attach="background"
        args={["#06111e"]}
      />

      <fog
        attach="fog"
        args={["#06111e", 22, 58]}
      />

      <ambientLight intensity={1.15} />

      <directionalLight
        position={[12, 18, 8]}
        intensity={2.2}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-25}
        shadow-camera-right={25}
        shadow-camera-top={25}
        shadow-camera-bottom={-25}
      />

      <hemisphereLight
        args={[
          "#8ddcff",
          "#07101c",
          1,
        ]}
      />

      {/* Main ground */}
      <mesh
        position={[0, -0.28, 0]}
        receiveShadow
      >
        <boxGeometry
          args={[42, 0.55, 32]}
        />

        <meshStandardMaterial
          color="#0b2230"
          roughness={0.88}
          metalness={0.05}
        />
      </mesh>

      {/* Inner world surface */}
      <mesh
        position={[0, 0.005, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        receiveShadow
      >
        <planeGeometry
          args={[39, 29]}
        />

        <meshStandardMaterial
          color="#0d2c35"
          roughness={0.9}
          metalness={0.05}
        />
      </mesh>

      {/* Map grid */}
      <gridHelper
        args={[
          40,
          40,
          "#226383",
          "#123a4c",
        ]}
        position={[0, 0.025, 0]}
      />

      {/* Roads from Home */}
      {destinationOrder
        .filter((key) => key !== "home")
        .map((key) => (
          <Road
            key={key}
            from={homePosition}
            to={destinations[key].position}
          />
        ))}

      {/* All destinations */}
      {destinationOrder.map((key) => (
        <Landmark
          key={key}
          destinationKey={key}
        />
      ))}

      {/* Trees */}
      {treePositions.map(
        (tree, index) => (
          <Tree
            key={`${tree.position.join("-")}-${index}`}
            position={tree.position}
            scale={tree.scale}
          />
        ),
      )}
    </>
  );
}



