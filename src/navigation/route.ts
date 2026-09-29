import { useCallback, useEffect, useState } from "react";
import type { ProjectId } from "../content/types";

// The current view lives in the URL hash so that every view can be linked
// to and the browser's Back button works:
//
//   #            -> hero                  #project/limics -> project detail
//   #about                                #legal          -> legal notice
//   #path        -> "Parcours"
//   #projects
//   #contact

export const SCENES = ["hero", "about", "path", "projects", "contact"] as const;
export type SceneKey = (typeof SCENES)[number];

const PROJECT_IDS: ProjectId[] = ["motus", "d3", "limics"];

export type Route =
  | { kind: "scene"; index: number }
  | { kind: "project"; id: ProjectId }
  | { kind: "legal" };

export function parseHash(hash: string): Route {
  const h = hash.replace(/^#\/?/, "");
  if (h === "legal") return { kind: "legal" };
  if (h.startsWith("project/")) {
    const id = h.slice("project/".length) as ProjectId;
    if (PROJECT_IDS.includes(id)) return { kind: "project", id };
  }
  const index = SCENES.indexOf(h as SceneKey);
  return { kind: "scene", index: Math.max(0, index) };
}

export function routeToHash(route: Route): string {
  if (route.kind === "legal") return "#legal";
  if (route.kind === "project") return `#project/${route.id}`;
  return route.index === 0 ? "" : `#${SCENES[route.index]}`;
}

/**
 * Current route + a navigate() function.
 * Scene-to-scene steps *replace* the history entry (going through several
 * scenes should not need as many Back presses); opening an overlay *pushes* one,
 * so Back closes it.
 */
export function useRoute() {
  const [route, setRoute] = useState<Route>(() => parseHash(location.hash));

  useEffect(() => {
    const onHashChange = () => setRoute(parseHash(location.hash));
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const navigate = useCallback((next: Route) => {
    const url = routeToHash(next) || location.pathname + location.search;
    if (next.kind === "scene") history.replaceState(null, "", url);
    else history.pushState({ overlay: true }, "", url);
    setRoute(next); // pushState/replaceState do not fire hashchange
  }, []);

  /**
   * Leaves an overlay. If we opened it ourselves, step back in history so the
   * overlay entry disappears; if the visitor landed on it from a link, there
   * is nothing to go back to on this site, so replace it with `fallback`.
   */
  const closeOverlay = useCallback(
    (fallback: Route) => {
      if ((history.state as { overlay?: boolean } | null)?.overlay) history.back();
      else navigate(fallback);
    },
    [navigate],
  );

  return { route, navigate, closeOverlay };
}
