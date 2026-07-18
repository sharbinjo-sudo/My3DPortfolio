import {
  destinationOrder,
  destinations,
  type DestinationKey,
} from "../data/destinations";
import {
  type CharacterStatus,
  usePortfolioStore,
} from "../store/usePortfolioStore";

const statusLabels: Record<CharacterStatus, string> = {
  idle: "Ready",
  walking: "Walking...",
  running: "Running...",
  waving: "Greeting...",
  jumping: "Jumping...",
};

export function Navigation() {
  const experienceMode = usePortfolioStore((state) => state.experienceMode);
  const destination = usePortfolioStore((state) => state.destination);
  const activeSection = usePortfolioStore((state) => state.activeSection);
  const characterStatus = usePortfolioStore((state) => state.characterStatus);
  const travelTo = usePortfolioStore((state) => state.travelTo);
  const openPanel = usePortfolioStore((state) => state.openPanel);

  if (experienceMode !== "guided") {
    return null;
  }

  const isTravelling =
    characterStatus === "walking" || characterStatus === "running";

  const handleTravel = (key: DestinationKey) => {
    const characterIsHere =
      !isTravelling && key === destination && key === activeSection;

    if (characterIsHere) {
      openPanel();
      return;
    }

    travelTo(key);
  };

  return (
    <nav
      className="navigation"
      aria-label="Portfolio sections"
      aria-busy={isTravelling}
    >
      <div className="navigation-scroll">
        {destinationOrder.map((key) => {
          const isSelected = destination === key;

          return (
            <button
              key={key}
              type="button"
              className={isSelected ? "nav-button active" : "nav-button"}
              onClick={() => handleTravel(key)}
              aria-label={`Travel to or open ${destinations[key].label}`}
            >
              {destinations[key].label}
            </button>
          );
        })}
      </div>

      <span className="travel-status" aria-live="polite">
        {statusLabels[characterStatus]}
      </span>
    </nav>
  );
}
