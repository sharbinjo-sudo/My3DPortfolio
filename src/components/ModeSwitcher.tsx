import { usePortfolioStore } from "../store/usePortfolioStore";

const SAVED_MODE_KEY = "portfolio:preferred-mode";

export function ModeSwitcher() {
  const experienceMode = usePortfolioStore((state) => state.experienceMode);
  const returnToWelcome = usePortfolioStore((state) => state.returnToWelcome);

  if (experienceMode === "welcome") {
    return null;
  }

  const handleChangeMode = () => {
    window.localStorage.removeItem(SAVED_MODE_KEY);
    returnToWelcome();
  };

  return (
    <button
      type="button"
      className="mode-switcher"
      onClick={handleChangeMode}
      aria-label="Change exploration mode"
    >
      <span className="mode-switcher-dot" />
      {experienceMode === "guided" ? "Guided Mode" : "Explore Mode"}
      <small>Change</small>
    </button>
  );
}
