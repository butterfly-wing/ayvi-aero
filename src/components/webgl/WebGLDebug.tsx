"use client";

import { useMemo, useState } from "react";
import type { SceneId } from "@/lib/webgl";
import WebGLCanvas from "./WebGLCanvas";

export default function WebGLDebug() {
  const [scene, setScene] = useState<SceneId>("scene1");

  const items = useMemo(
    () => [
      { id: "scene1" as const, label: "scene1 (full)" },
      { id: "scene2" as const, label: "scene2 (faint)" },
      { id: "scene3" as const, label: "scene3 (fainter)" },
      { id: "scene4" as const, label: "scene4 (faintest)" },
      { id: "scene5" as const, label: "scene5 (legal)" },
      { id: "scene6" as const, label: "scene6 (project A)" },
      { id: "scene7" as const, label: "scene7 (project B)" },
    ],
    [],
  );

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-lg font-semibold">WebGL Glass Shards (Debug)</h1>

          <div className="flex flex-wrap gap-2">
            {items.map((it) => (
              <button
                key={it.id}
                type="button"
                onClick={() => setScene(it.id)}
                className={[
                  "rounded-xl border px-3 py-1.5 text-sm",
                  scene === it.id
                    ? "border-slate-900 bg-slate-900 text-white"
                    : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50",
                ].join(" ")}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1fr_360px]">
          <div className="rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
            <WebGLCanvas scene={scene} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="text-sm font-semibold">Notes</div>
            <ul className="mt-2 list-disc space-y-2 pl-5 text-sm text-slate-700">
              <li>
                Renderer выбирает конфиг сцены по <code>SceneId</code>.
              </li>
              <li>Fill — alpha blend, edges — additive (gold pass).</li>
              <li>
                Если передали неизвестную сцену — будет fallback на{" "}
                <code>scene1</code>.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
