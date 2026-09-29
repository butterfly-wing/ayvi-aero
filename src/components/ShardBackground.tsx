import { useEffect, useRef, useState } from "react";
import { createShardRenderer, type ShardRenderer } from "../webgl/renderer";

type Props = {
  /** 0..1 — how visible the shards are. Eased by the renderer. */
  intensity: number;
};

/**
 * Full-screen WebGL canvas behind everything. If WebGL2 is unavailable the
 * canvas is hidden and the plain page background remains.
 */
export default function ShardBackground({ intensity }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rendererRef = useRef<ShardRenderer | null>(null);
  const [failed, setFailed] = useState(false);

  // Latest intensity, read once the renderer has finished starting up.
  const intensityRef = useRef(intensity);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    createShardRenderer(canvas, { svgUrl: "/shards.svg", still })
      .then((renderer) => {
        // The component may have unmounted while the SVG was loading.
        if (cancelled) return renderer.destroy();
        renderer.setIntensity(intensityRef.current);
        rendererRef.current = renderer;
      })
      .catch((error) => {
        console.warn("Shard background disabled:", error);
        if (!cancelled) setFailed(true);
      });

    return () => {
      cancelled = true;
      rendererRef.current?.destroy();
      rendererRef.current = null;
    };
  }, []);

  useEffect(() => {
    intensityRef.current = intensity;
    rendererRef.current?.setIntensity(intensity);
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 h-full w-full"
      hidden={failed}
    />
  );
}
