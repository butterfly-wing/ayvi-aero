"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import WebGLFullscreen from "../webgl/WebGLFullscreen";
import type { SceneId } from "@/lib/webgl";

import Scene1 from "./Scene1";
import Scene2 from "./Scene2";
import Scene3 from "./Scene3";
import Scene4 from "./Scene4";
import Scene5 from "./Scene5";
import SceneProject from "./SceneProject";

function idxToScene(i: number): SceneId {
  return `scene${i}` as SceneId;
}

type Dir = 1 | -1;

function canScrollInDirection(el: HTMLElement, dir: Dir) {
  const top = el.scrollTop;
  const max = el.scrollHeight - el.clientHeight;
  const EPS = 1;

  if (max <= EPS) return false;
  if (dir > 0) return top < max - EPS;
  return top > EPS;
}

function isWheelSwipeNavigable(index: number) {
  return index >= 1 && index <= 4;
}

function getWheelSwipeNext(index: number, dir: Dir) {
  if (!isWheelSwipeNavigable(index)) return null;
  const next = index + dir;
  if (next < 1 || next > 4) return null;
  return next;
}

export default function SceneRoot() {
  const [sceneIndex, setSceneIndex] = useState<number>(1); // 1..7
  const [whiteOn, setWhiteOn] = useState(false);
  const [contentDim, setContentDim] = useState(false);

  const [scene2Enter, setScene2Enter] = useState(false);
  const [scene3Enter, setScene3Enter] = useState(false);

  const transitioningRef = useRef(false);
  const wheelAccRef = useRef(0);

  // scroll refs
  const scene2ScrollRef = useRef<HTMLDivElement | null>(null);
  const scene3ScrollRef = useRef<HTMLDivElement | null>(null); // ✅ NEW
  const scene5ScrollRef = useRef<HTMLDivElement | null>(null);
  const scene6ScrollRef = useRef<HTMLDivElement | null>(null);
  const scene7ScrollRef = useRef<HTMLDivElement | null>(null);

  const getScrollContainer = useCallback((): HTMLElement | null => {
    if (sceneIndex === 2) return scene2ScrollRef.current;
    if (sceneIndex === 3) return scene3ScrollRef.current; // ✅ NEW
    if (sceneIndex === 5) return scene5ScrollRef.current;
    if (sceneIndex === 6) return scene6ScrollRef.current;
    if (sceneIndex === 7) return scene7ScrollRef.current;
    return null;
  }, [sceneIndex]);

  const scene: SceneId = useMemo(
    () => idxToScene(Math.min(sceneIndex, 4)),
    [sceneIndex],
  );

  const runTransitionTo = useCallback((nextIndex: number) => {
    setContentDim(true);

    const t0 = window.setTimeout(() => setWhiteOn(true), 40);
    const t1 = window.setTimeout(() => setSceneIndex(nextIndex), 180);
    const t2 = window.setTimeout(() => {
      setWhiteOn(false);
      setContentDim(false);
      transitioningRef.current = false;
      wheelAccRef.current = 0;
    }, 420);

    return () => {
      window.clearTimeout(t0);
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      transitioningRef.current = false;
      wheelAccRef.current = 0;
    };
  }, []);

  const requestTransition = useCallback(
    (nextIndex: number) => {
      if (transitioningRef.current) return;
      transitioningRef.current = true;
      runTransitionTo(nextIndex);
    },
    [runTransitionTo],
  );

  const openProjectScene = useCallback(
    (targetIndex: number) => requestTransition(targetIndex),
    [requestTransition],
  );

  useEffect(() => {
    if (sceneIndex === 2) {
      setScene2Enter(false);
      const t = window.setTimeout(() => setScene2Enter(true), 120);
      return () => window.clearTimeout(t);
    }
    setScene2Enter(false);
  }, [sceneIndex]);

  useEffect(() => {
    if (sceneIndex === 3) {
      setScene3Enter(false);
      const t = window.setTimeout(() => setScene3Enter(true), 120);
      return () => window.clearTimeout(t);
    }
    setScene3Enter(false);
  }, [sceneIndex]);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    const prevHtmlOverflow = html.style.overflow;
    const prevBodyOverflow = body.style.overflow;

    html.style.overflow = "hidden";
    body.style.overflow = "hidden";

    const onTouchMove = (e: TouchEvent) => {
      // allow touch scrolling only in scenes with internal scrollers
      const allowTouch =
        sceneIndex === 2 ||
        sceneIndex === 3 ||
        sceneIndex === 5 ||
        sceneIndex === 6 ||
        sceneIndex === 7;

      if (!allowTouch) e.preventDefault();
    };

    window.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => {
      html.style.overflow = prevHtmlOverflow;
      body.style.overflow = prevBodyOverflow;
      window.removeEventListener("touchmove", onTouchMove);
    };
  }, [sceneIndex]);

  // wheel navigation
  useEffect(() => {
    const THRESH = 70;

    const onWheel = (e: WheelEvent) => {
      if (transitioningRef.current) {
        e.preventDefault();
        return;
      }

      const dir: Dir = e.deltaY > 0 ? +1 : -1;

      // Let internal scroller consume wheel
      const sc = getScrollContainer();
      if (sc && canScrollInDirection(sc, dir)) {
        wheelAccRef.current = 0;
        return;
      }

      // scenes 5/6/7 never switch by wheel
      if (!isWheelSwipeNavigable(sceneIndex)) {
        wheelAccRef.current = 0;
        return;
      }

      // scenes 1..4: wheel as navigation
      e.preventDefault();

      wheelAccRef.current += e.deltaY;
      if (Math.abs(wheelAccRef.current) < THRESH) return;

      const stepDir: Dir = wheelAccRef.current > 0 ? +1 : -1;
      wheelAccRef.current = 0;

      const next = getWheelSwipeNext(sceneIndex, stepDir);
      if (next == null) return;

      requestTransition(next);
    };

    window.addEventListener("wheel", onWheel, {
      passive: false,
      capture: true,
    });
    return () => {
      window.removeEventListener("wheel", onWheel, { capture: true } as any);
    };
  }, [getScrollContainer, requestTransition, sceneIndex]);

  // swipe navigation
  useEffect(() => {
    const SWIPE_PX = 28;
    const VELOCITY = 0.25;

    let startY = 0;
    let startX = 0;
    let startT = 0;
    let locked = false;

    const onTouchStart = (e: TouchEvent) => {
      if (transitioningRef.current) return;
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      startY = t.clientY;
      startX = t.clientX;
      startT = performance.now();
      locked = false;
    };

    const onTouchMove = (e: TouchEvent) => {
      if (transitioningRef.current) return;
      if (e.touches.length !== 1) return;

      const t = e.touches[0];
      const dy = t.clientY - startY;
      const dx = t.clientX - startX;

      if (Math.abs(dx) > Math.abs(dy) * 0.9) return;

      const dir: Dir = dy < 0 ? +1 : -1;

      const sc = getScrollContainer();
      if (sc && canScrollInDirection(sc, dir)) {
        locked = false;
        return;
      }

      if (!isWheelSwipeNavigable(sceneIndex)) {
        locked = false;
        return;
      }

      if (!locked && Math.abs(dy) > 8 && Math.abs(dy) > Math.abs(dx) * 1.2) {
        locked = true;
      }
      if (locked) e.preventDefault();
    };

    const onTouchEnd = (e: TouchEvent) => {
      if (transitioningRef.current) return;

      const endT = performance.now();
      const dt = Math.max(1, endT - startT);

      const t = e.changedTouches[0];
      if (!t) return;

      const dy = t.clientY - startY;
      const dx = t.clientX - startX;

      if (Math.abs(dx) > Math.abs(dy) * 0.9) return;

      const v = Math.abs(dy) / dt;
      const enough = Math.abs(dy) >= SWIPE_PX || v >= VELOCITY;
      if (!enough) return;

      const dir: Dir = dy < 0 ? +1 : -1;

      const sc = getScrollContainer();
      if (sc && canScrollInDirection(sc, dir)) return;

      const next = getWheelSwipeNext(sceneIndex, dir);
      if (next == null) return;

      requestTransition(next);
    };

    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onTouchEnd);
    };
  }, [getScrollContainer, requestTransition, sceneIndex]);

  return (
    <div
      className="fixed inset-0 overflow-hidden bg-white"
      style={{ width: "100vw", height: "100vh" }}
    >
      <WebGLFullscreen scene={scene} />

      <div
        className="fixed inset-0 z-20"
        style={{
          opacity: contentDim ? 0 : 1,
          transition: "opacity 220ms ease-out",
        }}
      >
        {sceneIndex === 1 && <Scene1 />}

        {sceneIndex === 2 && (
          <Scene2 enter={scene2Enter} scrollRef={scene2ScrollRef} />
        )}

        {sceneIndex === 3 && (
          <Scene3
            enter={scene3Enter}
            onOpenProject={openProjectScene}
            scrollRef={scene3ScrollRef} // ✅ NEW
          />
        )}

        {sceneIndex === 4 && (
          <Scene4 onOpenLegal={() => requestTransition(5)} />
        )}

        {sceneIndex === 5 && (
          <Scene5
            scrollRef={scene5ScrollRef}
            onBack={() => requestTransition(4)}
          />
        )}

        {sceneIndex === 6 && (
          <SceneProject
            kind="motus"
            scrollRef={scene6ScrollRef}
            onBack={() => requestTransition(3)}
          />
        )}

        {sceneIndex === 7 && (
          <SceneProject
            kind="d3"
            scrollRef={scene7ScrollRef}
            onBack={() => requestTransition(3)}
          />
        )}
      </div>

      <div
        className="pointer-events-none fixed inset-0 z-40 bg-white"
        style={{
          opacity: whiteOn ? 1 : 0,
          transition: "opacity 220ms ease-out",
        }}
      />
    </div>
  );
}
