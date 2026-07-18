import { useEffect, useState } from "react";
import {
  type ExperienceMode,
  usePortfolioStore,
} from "../store/usePortfolioStore";

const SAVED_MODE_KEY = "portfolio:preferred-mode";
type SelectableMode = Exclude<ExperienceMode, "welcome">;

function isSelectableMode(value: string | null): value is SelectableMode {
  return value === "guided" || value === "explore";
}

export function WelcomeScreen() {
  const experienceMode = usePortfolioStore((state) => state.experienceMode);
  const selectMode = usePortfolioStore((state) => state.selectMode);
  const [dontShowAgain, setDontShowAgain] = useState(false);

  useEffect(() => {
    const savedMode = window.localStorage.getItem(SAVED_MODE_KEY);

    if (isSelectableMode(savedMode)) {
      selectMode(savedMode);
      return;
    }

    if (savedMode) {
      window.localStorage.removeItem(SAVED_MODE_KEY);
    }
  }, [selectMode]);

  const handleSelectMode = (mode: SelectableMode) => {
    if (dontShowAgain) {
      window.localStorage.setItem(SAVED_MODE_KEY, mode);
    } else {
      window.localStorage.removeItem(SAVED_MODE_KEY);
    }

    selectMode(mode);
  };

  if (experienceMode !== "welcome") {
    return null;
  }

  return (
    <div className="welcome-screen">
      <div className="welcome-background-glow" />

      <section className="welcome-card game-mode-panel">
        <div className="welcome-panel-topline">
          <span className="welcome-badge">PLAYER ENTRY</span>
          <span className="welcome-panel-status">ONLINE</span>
        </div>

        <h1>
          Welcome to
          <span> Portfolio World</span>
        </h1>

        <p className="welcome-description">
          Choose your play style and enter the interactive portfolio map.
        </p>

        <div className="mode-card-grid">
          <button
            type="button"
            className="mode-card"
            onClick={() => handleSelectMode("guided")}
          >
            <span className="mode-card-icon">01</span>

            <span className="mode-card-content">
              <strong>Guided Mode</strong>
              <small>
                Use menu buttons and glowing platforms. The character
                automatically walks to each portfolio location.
              </small>
            </span>

            <span className="mode-card-action">Start Guided Tour</span>
          </button>

          <button
            type="button"
            className="mode-card featured"
            onClick={() => handleSelectMode("explore")}
          >
            <span className="mode-card-icon">02</span>

            <span className="mode-card-content">
              <strong>Self Exploration</strong>
              <small>
                Walk freely using WASD or arrow keys. Sprint, jump and
                explore every location yourself.
              </small>
            </span>

            <span className="mode-card-action">Explore Freely</span>
          </button>
        </div>

        <label className="dont-show-option">
          <input
            type="checkbox"
            checked={dontShowAgain}
            onChange={(event) => setDontShowAgain(event.target.checked)}
          />
          <span className="checkbox-frame" aria-hidden="true" />
          <span>
            <strong>Don&apos;t show again</strong>
            <small>Remember my selected mode on this device.</small>
          </span>
        </label>

        <div className="welcome-controls-preview">
          <span>WASD / Arrows - Move</span>
          <span>Shift - Sprint</span>
          <span>Space - Jump</span>
        </div>
      </section>
    </div>
  );
}
