import { useCallback, type ReactNode } from "react";
import { LangSwitch, SceneIndicator } from "./components/Chrome";
import ShardBackground from "./components/ShardBackground";
import { useLang } from "./i18n/context";
import { SCENES, useRoute, type SceneKey } from "./navigation/route";
import { useSceneInput } from "./navigation/useSceneInput";
import Legal from "./overlays/Legal";
import ProjectDetail from "./overlays/ProjectDetail";
import About from "./scenes/About";
import Contact from "./scenes/Contact";
import Hero from "./scenes/Hero";
import Path from "./scenes/Path";
import Projects from "./scenes/Projects";
import Scene, { type ScenePosition } from "./scenes/Scene";

/** How strongly the shard background shows behind each scene (0..1). */
const SCENE_INTENSITY: Record<SceneKey, number> = {
  hero: 1,
  about: 0.6,
  path: 0.5,
  projects: 0.5,
  contact: 0.5,
};
// Scenes that overlays are opened from, and return to.
const PROJECTS = SCENES.indexOf("projects");
const CONTACT = SCENES.indexOf("contact");

const OVERLAY_INTENSITY = 0.4;

export default function App() {
  const { t } = useLang();
  const { route, navigate, closeOverlay } = useRoute();

  // Scene shown underneath: the active one, or the one an overlay was opened from.
  const sceneIndex =
    route.kind === "scene" ? route.index : route.kind === "project" ? PROJECTS : CONTACT;
  const overlayOpen = route.kind !== "scene";

  const goTo = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(SCENES.length - 1, index));
      if (clamped !== sceneIndex) navigate({ kind: "scene", index: clamped });
    },
    [navigate, sceneIndex],
  );

  useSceneInput({
    enabled: !overlayOpen,
    onStep: (dir) => goTo(sceneIndex + dir),
    onJump: (to) => goTo(to === "first" ? 0 : SCENES.length - 1),
  });

  // Stable references: Overlay re-runs its focus/keyboard effect when onClose changes.
  const closeProject = useCallback(
    () => closeOverlay({ kind: "scene", index: PROJECTS }),
    [closeOverlay],
  );
  const closeLegal = useCallback(
    () => closeOverlay({ kind: "scene", index: CONTACT }),
    [closeOverlay],
  );

  const position = (i: number): ScenePosition =>
    i === sceneIndex ? "active" : i < sceneIndex ? "before" : "after";

  const sceneContent: Record<SceneKey, ReactNode> = {
    hero: <Hero onNext={() => goTo(1)} onContact={() => goTo(CONTACT)} />,
    about: <About />,
    path: <Path />,
    projects: <Projects onOpen={(id) => navigate({ kind: "project", id })} />,
    contact: <Contact onOpenLegal={() => navigate({ kind: "legal" })} />,
  };

  return (
    <>
      <ShardBackground intensity={overlayOpen ? OVERLAY_INTENSITY : SCENE_INTENSITY[SCENES[sceneIndex]]} />

      <LangSwitch />

      <main className="fixed inset-0" inert={overlayOpen}>
        {SCENES.map((key, i) => (
          <Scene key={key} id={key} label={t.ui.sections[key]} position={overlayOpen ? "before" : position(i)}>
            {sceneContent[key]}
          </Scene>
        ))}
      </main>

      {!overlayOpen && <SceneIndicator active={sceneIndex} onSelect={goTo} />}

      {route.kind === "project" && (
        <ProjectDetail id={route.id} onClose={closeProject} />
      )}
      {route.kind === "legal" && <Legal onClose={closeLegal} />}
    </>
  );
}
