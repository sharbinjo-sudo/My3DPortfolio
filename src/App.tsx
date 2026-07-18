import { ExploreControls } from "./components/ExploreControls";
import { ModeSwitcher } from "./components/ModeSwitcher";
import { Navigation } from "./components/Navigation";
import { SectionPanel } from "./components/SectionPanel";
import { WelcomeScreen } from "./components/WelcomeScreen";
import { profile } from "./data/profile";
import { PortfolioCanvas } from "./world/PortfolioCanvas";

export default function App() {
  return (
    <main className="app-shell">
      <div className="canvas-layer">
        <PortfolioCanvas />
      </div>

      <header className="brand">
        <span className="brand-mark">{profile.initials}</span>
        <div>
          <strong>{profile.name}</strong>
          <span>
            {profile.role} - {profile.status}
          </span>
        </div>
      </header>

      <div className="top-links" aria-label="Professional links">
        <a href={profile.github} target="_blank" rel="noreferrer">
          GitHub
        </a>
        <a href={profile.linkedin} target="_blank" rel="noreferrer">
          LinkedIn
        </a>
      </div>

      <SectionPanel />
      <Navigation />
      <ExploreControls />
      <ModeSwitcher />
      <WelcomeScreen />
    </main>
  );
}
