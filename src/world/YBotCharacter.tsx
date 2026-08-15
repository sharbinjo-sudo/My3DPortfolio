import { useAnimations, useGLTF } from "@react-three/drei";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import {
  type CharacterStatus,
  usePortfolioStore,
} from "../store/usePortfolioStore";

interface YBotCharacterProps {
  status: CharacterStatus;
}

const MODEL_PATH = "/models/portfolio-ybot.glb";
const JUMP_TRIM_START_FRAME = 18;
const JUMP_TRIM_END_FRAME = 44;
const JUMP_TRIM_FPS = 30;
const JUMP_PLAYBACK_SPEED = 1.6;

const animationNames: Record<CharacterStatus, string> = {
  idle: "Idle",
  walking: "Walk",
  running: "Run",
  waving: "Wave",
  jumping: "JumpTrimmed",
};

export function YBotCharacter({ status }: YBotCharacterProps) {
  const animationRoot = useRef<THREE.Group>(null);
  const { scene, animations } = useGLTF(MODEL_PATH);

  const trimmedAnimations = useMemo(
    () =>
      animations.map((clip) => {
        if (clip.name !== "Jump") {
          return clip;
        }

        return THREE.AnimationUtils.subclip(
          clip,
          "JumpTrimmed",
          JUMP_TRIM_START_FRAME,
          JUMP_TRIM_END_FRAME,
          JUMP_TRIM_FPS,
        );
      }),
    [animations],
  );

  const { actions, names, mixer } = useAnimations(
    trimmedAnimations,
    animationRoot,
  );
  const setCharacterStatus = usePortfolioStore((state) => state.setCharacterStatus);
  const openPanel = usePortfolioStore((state) => state.openPanel);

  useEffect(() => {
    const clipName = animationNames[status];
    const action = actions[clipName];

    if (!action) {
      console.error(
        `Animation "${clipName}" was not found.`,
        "Available animations:",
        names,
      );
      return;
    }

    action.reset();

    const fadeDuration = status === "jumping" ? 0.12 : 0.25;
    action.timeScale = status === "jumping" ? JUMP_PLAYBACK_SPEED : 1;

    const isOneShot = status === "waving" || status === "jumping";

    if (isOneShot) {
      action.setLoop(THREE.LoopOnce, 1);
      action.clampWhenFinished = true;
    } else {
      action.setLoop(THREE.LoopRepeat, Infinity);
      action.clampWhenFinished = false;
    }

    action.fadeIn(fadeDuration).play();

    const handleFinished = (
      event: THREE.Event & {
        action?: THREE.AnimationAction;
      },
    ) => {
      if (status === "waving" && event.action === action) {
        setCharacterStatus("idle");

        if (usePortfolioStore.getState().experienceMode === "guided") {
          openPanel();
        }
      }
    };

    mixer.addEventListener("finished", handleFinished);

    return () => {
      mixer.removeEventListener("finished", handleFinished);
      action.fadeOut(fadeDuration);
      action.timeScale = 1;
    };
  }, [actions, mixer, names, openPanel, setCharacterStatus, status]);

  return (
    <group ref={animationRoot}>
      <primitive object={scene} dispose={null} />
    </group>
  );
}

useGLTF.preload(MODEL_PATH);






