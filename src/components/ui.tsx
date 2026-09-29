import type { ComponentProps, ReactNode } from "react";
import { CrystalLayers, type Tone } from "./Crystal";
import { hexShape, panelShape, type ShapeFn } from "./shapes";

// Visual building blocks shared by every scene. Text is always black or
// white; see Crystal.tsx for where the (only) colour comes from.

// Narrow blocks (phones) get smaller cuts, so the shape stays in proportion.
const panelWide = panelShape(34, 16);
const panelNarrow = panelShape(22, 12);
const panel: ShapeFn = (w, h) => (w < 520 ? panelNarrow : panelWide)(w, h);

/** Clear glass block. */
export function Panel({
  children,
  className = "",
  bodyClassName = "p-5 sm:p-8",
}: {
  children: ReactNode;
  className?: string;
  bodyClassName?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <CrystalLayers shape={panel} depth={6} />
      <div className={`relative h-full ${bodyClassName}`}>{children}</div>
    </div>
  );
}

/** Scene heading: heavy uppercase title, then a hairline that fades out. */
export function Heading({ children }: { children: ReactNode }) {
  return (
    <div className="mb-6 flex items-center gap-5 sm:mb-10">
      <h2 className="shrink-0 text-[clamp(1.9rem,4.2vw,3.5rem)] leading-none font-black tracking-[0.08em] uppercase">
        {children}
      </h2>
      <span aria-hidden="true" className="flex flex-1 items-center">
        <span className="h-px flex-1 bg-linear-to-r from-ink/60 to-ink/0" />
      </span>
    </div>
  );
}

/** Small uppercase label above a block of content. */
export function Label({ children }: { children: ReactNode }) {
  return (
    <h3 className="mb-4 text-xs font-semibold tracking-[0.24em] text-ink/55 uppercase">{children}</h3>
  );
}

/** Small glass tag. */
export function Tag({ children }: { children: ReactNode }) {
  return (
    <li className="relative px-4 py-1.5 text-xs font-semibold tracking-wider">
      <CrystalLayers shape={hexShape} depth={3} />
      <span className="relative">{children}</span>
    </li>
  );
}

type ButtonProps = { tone?: Tone } & (
  | ({ href: string } & ComponentProps<"a">)
  | ({ href?: undefined } & ComponentProps<"button">)
);

/**
 * Crystal button: black or clear glass. On hover it lifts slightly and a
 * glint crosses it. Renders an <a> when given href, otherwise a <button>.
 */
export function Button({ tone = "dark", className = "", children, ...props }: ButtonProps) {
  const cls = `group relative inline-flex items-center justify-center gap-3 px-7 py-3.5 text-xs font-semibold tracking-[0.1em] whitespace-nowrap uppercase sm:px-9 sm:text-sm sm:tracking-[0.14em] transition-[translate,filter] duration-500 ease-crystal hover:-translate-y-[3px] focus-visible:-translate-y-[3px] ${
    tone === "dark"
      ? "text-paper drop-shadow-[0_2px_2px_rgb(0_0_0/0.15)] hover:drop-shadow-[0_10px_12px_rgb(0_0_0/0.22)]"
      : "text-ink"
  } ${className}`;
  const inner = (
    <>
      <CrystalLayers shape={hexShape} tone={tone} depth={4} interactive />
      <span className="relative flex items-center gap-3">{children}</span>
    </>
  );
  if (props.href !== undefined)
    return (
      <a className={cls} {...(props as ComponentProps<"a">)}>
        {inner}
      </a>
    );
  return (
    <button type="button" className={cls} {...(props as ComponentProps<"button">)}>
      {inner}
    </button>
  );
}

/** List with small black diamond bullets. */
export function CrystalList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2.5">
      {items.map((item) => (
        <li key={item} className="flex items-baseline gap-3">
          <span aria-hidden="true" className="size-1.5 shrink-0 -translate-y-0.5 rotate-45 bg-ink" />
          {item}
        </li>
      ))}
    </ul>
  );
}
