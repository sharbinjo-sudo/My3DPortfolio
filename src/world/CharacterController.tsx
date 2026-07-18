import { useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef, type RefObject } from "react";
import * as THREE from "three";
import {
  destinationOrder,
  destinations,
  type DestinationKey,
} from "../data/destinations";
import { usePortfolioStore } from "../store/usePortfolioStore";
import { YBotCharacter } from "./YBotCharacter";

interface CharacterControllerProps {
  characterRef: RefObject<THREE.Group | null>;
}

const WALK_SPEED = 2.8;
const RUN_SPEED = 5.3;
const RUN_DISTANCE = 7;

const EXPLORE_WALK_SPEED = 3.1;
const EXPLORE_RUN_SPEED = 6;

const ARRIVAL_DISTANCE = 0.08;
const LOCATION_DISTANCE = 2.1;
const TURN_SPEED = 12;

const JUMP_VELOCITY = 4.85;
const RISE_GRAVITY = 18;
const FALL_GRAVITY = 24;

const MIN_WORLD_X = -18;
const MAX_WORLD_X = 18;
const MIN_WORLD_Z = -13;
const MAX_WORLD_Z = 13;

const GROUND_Y = destinations.home.position[1];

function shortestAngleDelta(from: number, to: number) {
  return THREE.MathUtils.euclideanModulo(
    to - from + Math.PI,
    Math.PI * 2,
  ) - Math.PI;
}

function normalizeAngle(angle: number) {
  return THREE.MathUtils.euclideanModulo(
    angle + Math.PI,
    Math.PI * 2,
  ) - Math.PI;
}

function dampAngle(
  current: number,
  target: number,
  smoothing: number,
  delta: number,
) {
  return normalizeAngle(
    THREE.MathUtils.damp(
      current,
      current + shortestAngleDelta(current, target),
      smoothing,
      delta,
    ),
  );
}
function clampInput(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export function CharacterController({ characterRef }: CharacterControllerProps) {
  const characterStatus = usePortfolioStore((state) => state.characterStatus);
  const experienceMode = usePortfolioStore((state) => state.experienceMode);

  const pressedKeys = useRef<Set<string>>(new Set());
  const verticalVelocity = useRef(0);
  const isGrounded = useRef(true);
  const lastJumpRequestId = useRef(0);

  const targetPosition = useMemo(() => new THREE.Vector3(), []);
  const movementDirection = useMemo(() => new THREE.Vector3(), []);
  const cameraForward = useMemo(() => new THREE.Vector3(), []);
  const cameraRight = useMemo(() => new THREE.Vector3(), []);
  const worldUp = useMemo(() => new THREE.Vector3(0, 1, 0), []);

  useEffect(() => {
    if (experienceMode !== "explore") {
      pressedKeys.current.clear();
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const isTyping =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.isContentEditable;

      if (isTyping) {
        return;
      }

      const controlledKeys = [
        "KeyW",
        "KeyA",
        "KeyS",
        "KeyD",
        "ArrowUp",
        "ArrowDown",
        "ArrowLeft",
        "ArrowRight",
        "ShiftLeft",
        "ShiftRight",
        "Space",
      ];

      if (controlledKeys.includes(event.code)) {
        event.preventDefault();
      }

      pressedKeys.current.add(event.code);

      if (event.code === "Space" && !event.repeat) {
        usePortfolioStore.getState().requestJump();
      }
    };

    const handleKeyUp = (event: KeyboardEvent) => {
      pressedKeys.current.delete(event.code);
    };

    const handleWindowBlur = () => {
      pressedKeys.current.clear();
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleWindowBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleWindowBlur);
      pressedKeys.current.clear();
    };
  }, [experienceMode]);

  useEffect(() => {
    lastJumpRequestId.current = usePortfolioStore.getState().jumpRequestId;
  }, [experienceMode]);

  useFrame(({ camera }, frameDelta) => {
    const character = characterRef.current;

    if (!character) {
      return;
    }

    const delta = Math.min(frameDelta, 0.05);
    const state = usePortfolioStore.getState();

    if (state.experienceMode === "welcome") {
      return;
    }

    if (state.characterStatus === "waving") {
      return;
    }

    if (state.isPanelVisible) {
      if (isGrounded.current && state.characterStatus !== "idle") {
        state.setCharacterStatus("idle");
      }

      return;
    }

    if (state.experienceMode === "guided") {
      const destinationPosition = destinations[state.destination].position;

      targetPosition.set(
        destinationPosition[0],
        GROUND_Y,
        destinationPosition[2],
      );

      movementDirection.set(
        targetPosition.x - character.position.x,
        0,
        targetPosition.z - character.position.z,
      );

      const remainingDistance = movementDirection.length();

      if (remainingDistance > ARRIVAL_DISTANCE) {
        const shouldRun = remainingDistance > RUN_DISTANCE;
        const nextStatus = shouldRun ? "running" : "walking";

        if (state.characterStatus !== nextStatus) {
          state.setCharacterStatus(nextStatus);
        }

        movementDirection.normalize();

        const speed = shouldRun ? RUN_SPEED : WALK_SPEED;
        const movementAmount = Math.min(speed * delta, remainingDistance);

        character.position.addScaledVector(movementDirection, movementAmount);

        const targetRotation = Math.atan2(
          movementDirection.x,
          movementDirection.z,
        );

        character.rotation.y = dampAngle(
          character.rotation.y,
          targetRotation,
          TURN_SPEED,
          delta,
        );

        return;
      }

      character.position.x = targetPosition.x;
      character.position.z = targetPosition.z;
      character.position.y = GROUND_Y;

      if (state.activeSection !== state.destination) {
        state.arriveAt(state.destination);
      } else if (
        state.characterStatus === "walking" ||
        state.characterStatus === "running"
      ) {
        state.setCharacterStatus("idle");
      }

      return;
    }

    const keys = pressedKeys.current;
    const keyboardX =
      (keys.has("KeyD") || keys.has("ArrowRight") ? 1 : 0) -
      (keys.has("KeyA") || keys.has("ArrowLeft") ? 1 : 0);
    const keyboardZ =
      (keys.has("KeyS") || keys.has("ArrowDown") ? 1 : 0) -
      (keys.has("KeyW") || keys.has("ArrowUp") ? 1 : 0);

    const inputX = clampInput(keyboardX + state.movementInput.x);
    const inputZ = clampInput(keyboardZ + state.movementInput.z);
    const hasMovementInput = Math.abs(inputX) > 0.05 || Math.abs(inputZ) > 0.05;

    const keyboardSprint = keys.has("ShiftLeft") || keys.has("ShiftRight");
    const isSprinting = keyboardSprint || state.mobileSprint;

    if (state.jumpRequestId !== lastJumpRequestId.current) {
      lastJumpRequestId.current = state.jumpRequestId;

      if (isGrounded.current) {
        isGrounded.current = false;
        verticalVelocity.current = JUMP_VELOCITY;
        state.setCharacterStatus("jumping");
      }
    }

    if (hasMovementInput) {
      camera.getWorldDirection(cameraForward);
      cameraForward.y = 0;

      if (cameraForward.lengthSq() < 0.001) {
        cameraForward.set(0, 0, -1);
      }

      cameraForward.normalize();
      cameraRight.crossVectors(cameraForward, worldUp).normalize();

      movementDirection
        .copy(cameraRight)
        .multiplyScalar(inputX)
        .addScaledVector(cameraForward, -inputZ)
        .normalize();

      const speed = isSprinting ? EXPLORE_RUN_SPEED : EXPLORE_WALK_SPEED;
      character.position.addScaledVector(movementDirection, speed * delta);

      character.position.x = THREE.MathUtils.clamp(
        character.position.x,
        MIN_WORLD_X,
        MAX_WORLD_X,
      );
      character.position.z = THREE.MathUtils.clamp(
        character.position.z,
        MIN_WORLD_Z,
        MAX_WORLD_Z,
      );

      const targetRotation = Math.atan2(
        movementDirection.x,
        movementDirection.z,
      );

      character.rotation.y = dampAngle(
          character.rotation.y,
          targetRotation,
          TURN_SPEED,
          delta,
        );
    }

    if (!isGrounded.current) {
      const gravity =
        verticalVelocity.current > 0
          ? RISE_GRAVITY
          : FALL_GRAVITY;

      verticalVelocity.current -= gravity * delta;
      character.position.y += verticalVelocity.current * delta;

      if (character.position.y <= GROUND_Y) {
        character.position.y = GROUND_Y;
        verticalVelocity.current = 0;
        isGrounded.current = true;
      }
    }

    if (!isGrounded.current) {
      if (state.characterStatus !== "jumping") {
        state.setCharacterStatus("jumping");
      }
    } else if (hasMovementInput) {
      const movementStatus = isSprinting ? "running" : "walking";

      if (state.characterStatus !== movementStatus) {
        state.setCharacterStatus(movementStatus);
      }
    } else if (state.characterStatus !== "idle") {
      state.setCharacterStatus("idle");
    }

    let nearestSection: DestinationKey | null = null;
    let nearestDistance = Number.POSITIVE_INFINITY;

    for (const key of destinationOrder) {
      const location = destinations[key].position;
      const distance = Math.hypot(
        character.position.x - location[0],
        character.position.z - location[2],
      );

      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearestSection = key;
      }
    }

    const detectedLocation =
      nearestDistance <= LOCATION_DISTANCE ? nearestSection : null;

    if (state.nearbySection !== detectedLocation) {
      state.setNearbySection(detectedLocation);
    }
  });

  return (
    <group
      ref={characterRef}
      position={[
        destinations.home.position[0],
        destinations.home.position[1],
        destinations.home.position[2],
      ]}
    >
      <YBotCharacter status={characterStatus} />
    </group>
  );
}






