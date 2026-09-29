import type { ReactNode } from "react";

export type ScenePosition = "before" | "active" | "after";

const offset: Record<ScenePosition, string> = {
  before: "-translate-y-8 opacity-0",
  active: "translate-y-0 opacity-100",
  after: "translate-y-8 opacity-0",
};

/**
 * One full-screen scene. All scenes are mounted at once and stacked; only
 * the active one is visible. Inactive scenes are `inert` (not focusable,
 * hidden from screen readers) so keyboard users never land in them.
 *
 * The content box is a scroll area: if a scene does not fit (phone, short
 * laptop screen) it scrolls internally, and the mouse wheel only changes
 * scene once that area has been scrolled to the end.
 */
export default function Scene({
  id,
  label,
  position,
  children,
}: {
  id: string;
  label: string;
  position: ScenePosition;
  children: ReactNode;
}) {
  const active = position === "active";

  return (
    <section
      id={id}
      aria-label={label}
      inert={!active}
      className={`absolute inset-0 transition-[opacity,translate] duration-700 ease-crystal ${offset[position]} ${
        active ? "" : "pointer-events-none"
      }`}
    >
      <div
        data-scroll-area
        className="scroll-area h-full px-4 pt-20 pb-20 sm:pt-24 sm:pr-24 sm:pb-10 sm:pl-10 lg:pl-16 xl:pr-28 xl:pl-24"
      >
        {/* min-h-full + flex centers short content vertically and lets tall content scroll */}
        <div className="flex min-h-full w-full max-w-[1680px] flex-col justify-center">
          {children}
        </div>
      </div>
    </section>
  );
}
