import { useEffect, useRef } from "react";

type Direction = 1 | -1;

type Options = {
  /** When false, no input is captured (e.g. while an overlay is open). */
  enabled: boolean;
  /** Called with +1 (next scene) or -1 (previous scene). */
  onStep: (direction: Direction) => void;
  /** Called for Home / End. */
  onJump: (to: "first" | "last") => void;
};

// Tuning
const WHEEL_THRESHOLD = 60; // accumulated deltaY (px) needed to switch
const WHEEL_QUIET_MS = 180; // after a switch, the wheel must pause this long…
const STEP_COOLDOWN_MS = 650; // …and at least this much time must pass

/**
 * Turns the mouse wheel / trackpad and the keyboard into scene steps.
 *
 * Touch is deliberately not handled: on phones a swipe only scrolls the
 * scene's own content, and scenes are changed with the dots (Chrome.tsx).
 *
 * Inner scroll areas (elements with [data-scroll-area]) get priority: while
 * the area under the pointer can still scroll in the requested direction,
 * the event is left to it. Only once it hits its top/bottom does the wheel
 * switch scenes.
 */
export function useSceneInput({ enabled, onStep, onJump }: Options) {
  // Keep the latest callbacks without re-binding listeners on every render.
  const handlers = useRef({ onStep, onJump });
  useEffect(() => {
    handlers.current = { onStep, onJump };
  });

  useEffect(() => {
    if (!enabled) return;

    let lastStep = 0;
    let lastWheel = 0;
    let wheelSum = 0;
    let wheelLocked = false;

    const step = (dir: Direction) => {
      lastStep = performance.now();
      wheelSum = 0;
      wheelLocked = true;
      handlers.current.onStep(dir);
    };

    // ---- wheel / trackpad ----
    const onWheel = (e: WheelEvent) => {
      const now = performance.now();
      const gap = now - lastWheel;
      lastWheel = now;

      const dir: Direction = e.deltaY > 0 ? 1 : -1;
      if (canScroll(e.target, dir)) {
        wheelSum = 0;
        return;
      }
      // Trackpads keep emitting events (inertia) long after the finger
      // lifts. After a switch, ignore the wheel until the stream pauses
      // for WHEEL_QUIET_MS and the cooldown has passed.
      if (wheelLocked) {
        if (now - lastStep < STEP_COOLDOWN_MS || gap < WHEEL_QUIET_MS) return;
        wheelLocked = false;
      }
      wheelSum += e.deltaY;
      if (Math.abs(wheelSum) >= WHEEL_THRESHOLD) step(wheelSum > 0 ? 1 : -1);
    };

    // ---- keyboard ----
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.defaultPrevented || e.altKey || e.ctrlKey || e.metaKey) return;
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      const next = e.key === "ArrowDown" || e.key === "PageDown" || (e.key === " " && !e.shiftKey);
      const prev = e.key === "ArrowUp" || e.key === "PageUp" || (e.key === " " && e.shiftKey);

      if (next || prev) {
        const dir: Direction = next ? 1 : -1;
        if (canScroll(document.activeElement, dir)) return; // let a focused area scroll
        e.preventDefault();
        if (performance.now() - lastStep >= 300) step(dir);
      } else if (e.key === "Home" || e.key === "End") {
        e.preventDefault();
        handlers.current.onJump(e.key === "Home" ? "first" : "last");
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [enabled]);
}

/** True if the nearest [data-scroll-area] around `target` can scroll in `dir`. */
function canScroll(target: EventTarget | null, dir: Direction): boolean {
  if (!(target instanceof Element)) return false;
  const area = target.closest<HTMLElement>("[data-scroll-area]");
  if (!area) return false;
  const max = area.scrollHeight - area.clientHeight;
  if (max <= 1) return false;
  return dir === 1 ? area.scrollTop < max - 1 : area.scrollTop > 1;
}
