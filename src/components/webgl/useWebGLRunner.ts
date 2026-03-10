"use client";

import { useEffect, useRef } from "react";
import { startWebGL, type SceneId } from "@/lib/webgl";

type Opts = {
  scene: SceneId;
  svgUrl?: string;
  dprCap?: number;
};

export function useWebGLRunner(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  opts: Opts,
) {
  const stopRef = useRef<null | (() => void)>(null);
  const runIdRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    stopRef.current?.();
    stopRef.current = null;

    const runId = ++runIdRef.current;
    let alive = true;

    (async () => {
      try {
        const stop = await startWebGL(canvas, {
          svgUrl: opts.svgUrl ?? "/shards.svg",
          scene: opts.scene,
          dpr: Math.min(opts.dprCap ?? 2, window.devicePixelRatio || 1),
        });

        if (!alive || runId !== runIdRef.current) {
          stop();
          return;
        }

        stopRef.current = stop;
      } catch (e) {
        console.error("WebGL start failed:", e);
      }
    })();

    return () => {
      alive = false;
      stopRef.current?.();
      stopRef.current = null;
    };
  }, [canvasRef, opts.scene, opts.svgUrl, opts.dprCap]);
}
