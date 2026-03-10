"use client";

import { useRef } from "react";
import type { SceneId } from "@/lib/webgl";
import { useWebGLRunner } from "./useWebGLRunner";

type Props = {
  scene: SceneId;
};

export default function WebGLCanvas({ scene }: Props) {
  const ref = useRef<HTMLCanvasElement | null>(null);

  useWebGLRunner(ref, { scene });

  return (
    <div className="relative bg-white">
      <canvas
        ref={ref}
        className="block h-auto w-full rounded-xl bg-white"
        style={{ aspectRatio: "920/706" }}
      />
      <div className="pointer-events-none absolute left-3 top-3 rounded-lg border border-slate-200 bg-white/80 px-3 py-2 text-xs text-slate-700 backdrop-blur">
        WebGL2 • {scene}
      </div>
    </div>
  );
}
