import {
  destinationOrder,
  destinations,
} from "../data/destinations";

export interface CircleCollider {
  type: "circle";
  x: number;
  z: number;
  radius: number;
}

export interface BoxCollider {
  type: "box";
  x: number;
  z: number;
  halfWidth: number;
  halfDepth: number;
}

export type WorldCollider = CircleCollider | BoxCollider;

interface CollisionPoint {
  x: number;
  z: number;
}

const BUILDING_CENTER_Z_OFFSET = -1.8;
const BUILDING_HALF_WIDTH = 0.9;
const BUILDING_HALF_DEPTH = 0.75;
const BUILDING_PADDING = 0.18;
const TREE_COLLISION_RADIUS = 0.38;
const COLLISION_PASSES = 3;

export const BASE_GROUND_Y = destinations.home.position[1];
export const PLATFORM_TOP_Y = 0.1;
const PLATFORM_SURFACE_RADIUS = 1.28;

export const worldColliders: WorldCollider[] = [
  ...destinationOrder.map((key) => ({
    type: "box" as const,
    x: destinations[key].position[0],
    z: destinations[key].position[2] + BUILDING_CENTER_Z_OFFSET,
    halfWidth: BUILDING_HALF_WIDTH + BUILDING_PADDING,
    halfDepth: BUILDING_HALF_DEPTH + BUILDING_PADDING,
  })),
  {
    type: "circle",
    x: -12,
    z: -7,
    radius: TREE_COLLISION_RADIUS * 1.1,
  },
  {
    type: "circle",
    x: -10,
    z: 8,
    radius: TREE_COLLISION_RADIUS * 0.9,
  },
  {
    type: "circle",
    x: -6,
    z: -11,
    radius: TREE_COLLISION_RADIUS * 1.2,
  },
  {
    type: "circle",
    x: -2,
    z: 10,
    radius: TREE_COLLISION_RADIUS * 0.85,
  },
  {
    type: "circle",
    x: 4,
    z: -10,
    radius: TREE_COLLISION_RADIUS,
  },
  {
    type: "circle",
    x: 8,
    z: 9,
    radius: TREE_COLLISION_RADIUS * 1.15,
  },
  {
    type: "circle",
    x: 12,
    z: -5,
    radius: TREE_COLLISION_RADIUS * 0.95,
  },
  {
    type: "circle",
    x: 14,
    z: 6,
    radius: TREE_COLLISION_RADIUS * 1.1,
  },
  {
    type: "circle",
    x: -15,
    z: 2,
    radius: TREE_COLLISION_RADIUS * 0.8,
  },
  {
    type: "circle",
    x: 16,
    z: 1,
    radius: TREE_COLLISION_RADIUS * 0.9,
  },
];

export function getGroundHeight(x: number, z: number) {
  for (const key of destinationOrder) {
    const destination = destinations[key];
    const distance = Math.hypot(x - destination.position[0], z - destination.position[2]);

    if (distance <= PLATFORM_SURFACE_RADIUS) {
      return PLATFORM_TOP_Y;
    }
  }

  return BASE_GROUND_Y;
}

function resolveCircleCollider(
  point: CollisionPoint,
  previous: CollisionPoint,
  collider: CircleCollider,
  characterRadius: number,
): CollisionPoint {
  const dx = point.x - collider.x;
  const dz = point.z - collider.z;
  const minDistance = collider.radius + characterRadius;
  const distanceSquared = dx * dx + dz * dz;

  if (distanceSquared >= minDistance * minDistance) {
    return point;
  }

  let normalX = dx;
  let normalZ = dz;

  if (distanceSquared < 1e-6) {
    normalX = previous.x - collider.x;
    normalZ = previous.z - collider.z;

    if (Math.abs(normalX) < 1e-6 && Math.abs(normalZ) < 1e-6) {
      normalX = 1;
      normalZ = 0;
    }
  }

  const normalLength = Math.hypot(normalX, normalZ);

  return {
    x: collider.x + (normalX / normalLength) * minDistance,
    z: collider.z + (normalZ / normalLength) * minDistance,
  };
}

function resolveBoxCollider(
  point: CollisionPoint,
  previous: CollisionPoint,
  collider: BoxCollider,
  characterRadius: number,
): CollisionPoint {
  const expandedHalfWidth = collider.halfWidth + characterRadius;
  const expandedHalfDepth = collider.halfDepth + characterRadius;
  const offsetX = point.x - collider.x;
  const offsetZ = point.z - collider.z;

  if (
    Math.abs(offsetX) >= expandedHalfWidth ||
    Math.abs(offsetZ) >= expandedHalfDepth
  ) {
    return point;
  }

  const penetrationX = expandedHalfWidth - Math.abs(offsetX);
  const penetrationZ = expandedHalfDepth - Math.abs(offsetZ);

  if (penetrationX < penetrationZ) {
    const directionX =
      offsetX === 0
        ? Math.sign(previous.x - collider.x) || 1
        : Math.sign(offsetX);

    return {
      x: collider.x + directionX * expandedHalfWidth,
      z: point.z,
    };
  }

  const directionZ =
    offsetZ === 0
      ? Math.sign(previous.z - collider.z) || 1
      : Math.sign(offsetZ);

  return {
    x: point.x,
    z: collider.z + directionZ * expandedHalfDepth,
  };
}

export function resolveWorldPosition(
  nextX: number,
  nextZ: number,
  previousX: number,
  previousZ: number,
  characterRadius: number,
) {
  let resolvedPoint: CollisionPoint = {
    x: nextX,
    z: nextZ,
  };

  const previousPoint: CollisionPoint = {
    x: previousX,
    z: previousZ,
  };

  for (let pass = 0; pass < COLLISION_PASSES; pass += 1) {
    let adjusted = false;

    for (const collider of worldColliders) {
      const nextPoint =
        collider.type === "circle"
          ? resolveCircleCollider(
              resolvedPoint,
              previousPoint,
              collider,
              characterRadius,
            )
          : resolveBoxCollider(
              resolvedPoint,
              previousPoint,
              collider,
              characterRadius,
            );

      if (
        nextPoint.x !== resolvedPoint.x ||
        nextPoint.z !== resolvedPoint.z
      ) {
        resolvedPoint = nextPoint;
        adjusted = true;
      }
    }

    if (!adjusted) {
      break;
    }
  }

  return resolvedPoint;
}
