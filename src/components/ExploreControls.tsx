import {
  useEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { usePortfolioStore } from "../store/usePortfolioStore";

const JOYSTICK_RADIUS = 46;

export function ExploreControls() {
  const experienceMode = usePortfolioStore((state) => state.experienceMode);
  const isPanelVisible = usePortfolioStore((state) => state.isPanelVisible);
  const nearbySection = usePortfolioStore((state) => state.nearbySection);
  const setMovementInput = usePortfolioStore((state) => state.setMovementInput);
  const setMobileSprint = usePortfolioStore((state) => state.setMobileSprint);
  const requestJump = usePortfolioStore((state) => state.requestJump);

  const joystickRef = useRef<HTMLDivElement>(null);
  const activePointerId = useRef<number | null>(null);
  const [knobPosition, setKnobPosition] = useState({ x: 0, y: 0 });

  const resetJoystick = () => {
    activePointerId.current = null;
    setKnobPosition({ x: 0, y: 0 });
    setMovementInput(0, 0);
  };

  const updateJoystick = (clientX: number, clientY: number) => {
    const joystick = joystickRef.current;

    if (!joystick) {
      return;
    }

    const rect = joystick.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    let deltaX = clientX - centerX;
    let deltaY = clientY - centerY;
    const distance = Math.hypot(deltaX, deltaY);

    if (distance > JOYSTICK_RADIUS) {
      const scale = JOYSTICK_RADIUS / distance;
      deltaX *= scale;
      deltaY *= scale;
    }

    setKnobPosition({ x: deltaX, y: deltaY });
    setMovementInput(deltaX / JOYSTICK_RADIUS, deltaY / JOYSTICK_RADIUS);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    activePointerId.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updateJoystick(event.clientX, event.clientY);
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) {
      return;
    }

    updateJoystick(event.clientX, event.clientY);
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (activePointerId.current !== event.pointerId) {
      return;
    }

    resetJoystick();
  };

  useEffect(() => {
    return () => {
      setMovementInput(0, 0);
      setMobileSprint(false);
    };
  }, [setMobileSprint, setMovementInput]);

  if (experienceMode !== "explore" || isPanelVisible) {
    return null;
  }

  return (
    <>
      <div className="desktop-control-hint">
        <strong>SELF EXPLORATION</strong>

        <div>
          <kbd>WASD</kbd>
          <span>or</span>
          <kbd>ARROWS</kbd>
          <span>Move</span>
          <kbd>SHIFT</kbd>
          <span>Sprint</span>
          <kbd>SPACE</kbd>
          <span>Jump</span>
        </div>

        {nearbySection && (
          <small>Click the nearby building or platform to open its details.</small>
        )}
      </div>

      <div className="mobile-explore-controls">
        <div
          ref={joystickRef}
          className="mobile-joystick"
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerEnd}
          onPointerCancel={handlePointerEnd}
          onContextMenu={(event) => event.preventDefault()}
        >
          <div className="joystick-direction-ring" />
          <div
            className="joystick-knob"
            style={{
              transform: `translate(${knobPosition.x}px, ${knobPosition.y}px)`,
            }}
          />
        </div>

        <div className="mobile-action-buttons">
          <button
            type="button"
            className="mobile-action-button sprint-button"
            onPointerDown={() => setMobileSprint(true)}
            onPointerUp={() => setMobileSprint(false)}
            onPointerCancel={() => setMobileSprint(false)}
            onPointerLeave={() => setMobileSprint(false)}
          >
            <strong>RUN</strong>
            <small>Hold</small>
          </button>

          <button
            type="button"
            className="mobile-action-button jump-button"
            onPointerDown={(event) => {
              event.preventDefault();
              requestJump();
            }}
          >
            <strong>JUMP</strong>
            <small>Tap</small>
          </button>
        </div>
      </div>
    </>
  );
}
