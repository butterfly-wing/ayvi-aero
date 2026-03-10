"use client";

import { useRef } from "react";
import type { SceneId } from "@/lib/webgl";
import { useWebGLRunner } from "@/components/webgl/useWebGLRunner";

type Props = { scene: SceneId };

export default function WebGLFullscreen({ scene }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useWebGLRunner(canvasRef, { scene });

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-0 h-screen w-screen bg-white"
    />
  );
}
