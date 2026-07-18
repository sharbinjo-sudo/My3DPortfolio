export type DestinationKey =
  | "home"
  | "about"
  | "skills"
  | "experience"
  | "projects"
  | "contact";

export interface Destination {
  key: DestinationKey;
  label: string;
  subtitle: string;
  position: readonly [number, number, number];
}

export const destinations: Record<DestinationKey, Destination> = {
  home: {
    key: "home",
    label: "Home",
    subtitle: "Developer introduction",
    position: [0, 0, 0],
  },
  about: {
    key: "about",
    label: "About",
    subtitle: "Education and practical learning",
    position: [-6, 0, -4],
  },
  skills: {
    key: "skills",
    label: "Skills",
    subtitle: "Technologies and tools",
    position: [6, 0, -4],
  },
  experience: {
    key: "experience",
    label: "Experience",
    subtitle: "Freelance development work",
    position: [-6, 0, -9],
  },
  projects: {
    key: "projects",
    label: "Projects",
    subtitle: "Android and machine-learning applications",
    position: [6, 0, -9],
  },
  contact: {
    key: "contact",
    label: "Contact",
    subtitle: "Email, phone and professional profiles",
    position: [0, 0, -14],
  },
};

export const destinationOrder: DestinationKey[] = [
  "home",
  "about",
  "skills",
  "experience",
  "projects",
  "contact",
];
