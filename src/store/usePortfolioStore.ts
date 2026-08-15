import { create } from "zustand";
import type { DestinationKey } from "../data/destinations";

export type ExperienceMode = "welcome" | "guided" | "explore";

export type CharacterStatus =
  | "idle"
  | "walking"
  | "running"
  | "waving"
  | "jumping";

export interface MovementInput {
  x: number;
  z: number;
}

interface PortfolioState {
  destination: DestinationKey;
  activeSection: DestinationKey;
  nearbySection: DestinationKey | null;

  experienceMode: ExperienceMode;
  characterStatus: CharacterStatus;
  hasCompletedInitialGreeting: boolean;

  isPanelVisible: boolean;

  movementInput: MovementInput;
  mobileSprint: boolean;
  jumpRequestId: number;

  selectMode: (mode: Exclude<ExperienceMode, "welcome">) => void;
  returnToWelcome: () => void;

  travelTo: (destination: DestinationKey) => void;
  arriveAt: (destination: DestinationKey) => void;

  setNearbySection: (destination: DestinationKey | null) => void;
  setCharacterStatus: (status: CharacterStatus) => void;
  setMovementInput: (x: number, z: number) => void;
  setMobileSprint: (sprinting: boolean) => void;
  requestJump: () => void;

  openPanel: () => void;
  closePanel: () => void;
}

function clampInput(value: number) {
  return Math.max(-1, Math.min(1, value));
}

export const usePortfolioStore = create<PortfolioState>((set) => ({
  destination: "home",
  activeSection: "home",
  nearbySection: "home",

  experienceMode: "welcome",
  characterStatus: "idle",
  hasCompletedInitialGreeting: false,

  isPanelVisible: false,

  movementInput: {
    x: 0,
    z: 0,
  },

  mobileSprint: false,
  jumpRequestId: 0,

  selectMode: (mode) =>
    set((state) => ({
      experienceMode: mode,
      characterStatus: state.hasCompletedInitialGreeting ? "idle" : "waving",
      hasCompletedInitialGreeting: true,
      isPanelVisible: false,
      destination: state.activeSection,
      nearbySection: state.activeSection,
      movementInput: {
        x: 0,
        z: 0,
      },
      mobileSprint: false,
    })),

  returnToWelcome: () =>
    set({
      experienceMode: "welcome",
      characterStatus: "idle",
      isPanelVisible: false,
      movementInput: {
        x: 0,
        z: 0,
      },
      mobileSprint: false,
    }),

  travelTo: (destination) =>
    set({
      destination,
      characterStatus: "walking",
      isPanelVisible: false,
    }),

  arriveAt: (destination) =>
    set({
      destination,
      activeSection: destination,
      nearbySection: destination,
      characterStatus: "idle",
      isPanelVisible: false,
    }),

  setNearbySection: (destination) =>
    set((state) => ({
      nearbySection: destination,
      activeSection: destination ?? state.activeSection,
      destination: destination ?? state.destination,
    })),

  setCharacterStatus: (characterStatus) =>
    set({
      characterStatus,
    }),

  setMovementInput: (x, z) =>
    set({
      movementInput: {
        x: clampInput(x),
        z: clampInput(z),
      },
    }),

  setMobileSprint: (mobileSprint) =>
    set({
      mobileSprint,
    }),

  requestJump: () =>
    set((state) => ({
      jumpRequestId: state.jumpRequestId + 1,
    })),

  openPanel: () =>
    set({
      isPanelVisible: true,
    }),

  closePanel: () =>
    set({
      isPanelVisible: false,
    }),
}));


