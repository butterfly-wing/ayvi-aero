import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { registerGlareLayer } from "./glare";
import { extrude, inset, type ShapeFn } from "./shapes";

// A "crystal" is a slab of glass drawn as layers behind some content. Light
// comes from the top-left, so the slab's thickness shows on its bottom-right
// side. Bottom to top:
//
//   shadow  (clear glass) blurred copy of the slab, visible only around it
//   slab    the thickness strip: the shape extruded toward the bottom-right
//   body    the front face: translucent grey (or black glass), see index.css
//   glare   the page-wide golden glare (glare.ts) on the thickness strip and
//           along the face edges
//   glint   (interactive only) a band of light crossing the face on hover
//   light   (clear glass) soft white glow entering through the top-left
//           sides; (black glass) white highlight, prism fringe and hairlines
//
// Colour on the site only appears as light on glass. Text and fills stay
// black and white.
//
// Shapes (shapes.ts) are point lists in pixels computed from the element's
// measured size, so cuts and thickness keep a fixed size at any width.

export type Tone = "glass" | "dark";

type Pt = [number, number];

// Light entering through the top-left sides of clear glass: a wide white
// stroke along those sides (half of it inside the face), heavily blurred.
const GLOW_WIDTH = 90; // px
const GLOW_BLUR = 16; // px, Gaussian standard deviation
const GLOW_OPACITY = 0.3; // at the top-left corner
const GLOW_REACH = 1.4; // how far it spreads, × the block's shorter side

// Thickness strip colour for clear glass: the face's grey, a touch denser.
const SLAB_TINT = "#5f6678";

// Spectrum of the prism fringe on black glass: pink, gold, mint, blue.
const PRISM = ["#ffb3d9", "#ffe9a8", "#a8f0dc", "#a9c4ff"];

function useElementSize<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => {
      const box = entry.borderBoxSize[0];
      setSize({ w: box.inlineSize, h: box.blockSize });
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return { ref, ...size };
}

const toPoints = (pts: Pt[]) => pts.map(([x, y]) => `${x},${y}`).join(" ");
const toPath = (pts: Pt[]) => `M${pts.map(([x, y]) => `${x} ${y}`).join(" L")} Z`;
const toClip = (pts: Pt[]) => `polygon(${pts.map(([x, y]) => `${x}px ${y}px`).join(",")})`;

/**
 * Path made of only the sides that face the light (top and left). Points are
 * clockwise on screen, so side a→b faces left when dy < 0 and up when dx > 0.
 */
const litEdges = (pts: Pt[]) =>
  pts
    .map((a, i) => [a, pts[(i + 1) % pts.length]] as const)
    .filter(([a, b]) => b[1] - a[1] < 0 || b[0] - a[0] > 0)
    .map(([a, b]) => `M${a[0]} ${a[1]} L${b[0]} ${b[1]}`)
    .join(" ");

/** Gradient stops for a narrow spectral band centred at `at` (0..1). */
function prismStops(at: number, width: number, opacity: number) {
  const step = width / (PRISM.length + 1);
  const start = at - width / 2;
  return [
    <stop key="s" offset={start} stopColor={PRISM[0]} stopOpacity={0} />,
    ...PRISM.map((color, i) => (
      <stop key={color} offset={start + step * (i + 1)} stopColor={color} stopOpacity={opacity} />
    )),
    <stop key="e" offset={start + width} stopColor={PRISM[PRISM.length - 1]} stopOpacity={0} />,
  ];
}

/**
 * The visual layers of a crystal. Place it as the first child of a
 * `relative` element; the element's own content goes after it with
 * `relative` positioning so it sits on top.
 */
export function CrystalLayers({
  shape,
  tone = "glass",
  depth = 6,
  interactive = false,
}: {
  shape: ShapeFn;
  tone?: Tone;
  /** Visible thickness of the glass on the bottom-right side, in px. */
  depth?: number;
  /** Adds the hover glint. The parent must have the `group` class. */
  interactive?: boolean;
}) {
  const { ref, w, h } = useElementSize<HTMLDivElement>();
  const id = useId().replace(/[^a-zA-Z0-9]/g, "");
  const slabGlare = useRef<HTMLDivElement>(null);
  const edgeGlare = useRef<HTMLDivElement>(null);
  const measured = w > 0;

  // The glare layers only exist once the size is known.
  useEffect(() => {
    if (!measured) return;
    const off = [slabGlare.current, edgeGlare.current]
      .filter((el): el is HTMLDivElement => el !== null)
      .map(registerGlareLayer);
    return () => off.forEach((f) => f());
  }, [measured]);

  const layerClass = "pointer-events-none absolute inset-0";
  if (!measured) return <div ref={ref} aria-hidden="true" className={layerClass} />;

  const face = shape(w, h);
  const slab = extrude(face, depth);
  const dark = tone === "dark";
  const faceClip = toClip(face);
  const strip = `${toPath(slab)} ${toPath(face)}`; // even-odd: slab minus face

  return (
    <div ref={ref} aria-hidden="true" className={layerClass}>
      {/* Shadow. The inner element is clipped to the slab and the wrapper
          blurs it (clip then blur, so the edge stays soft). The outer
          element cuts the slab back out, so the shadow never tints the glass. */}
      {!dark && (
        <div
          className="absolute inset-0"
          style={{ clipPath: `path(evenodd, "M-100 -100 H${w + 100} V${h + 100} H-100 Z ${toPath(slab)}")` }}
        >
          <div className="crystal-shadow">
            <div className="absolute inset-0 bg-ink/14" style={{ clipPath: toClip(slab) }} />
          </div>
        </div>
      )}

      {/* Slab: only the strip between the slab outline and the face. */}
      <svg className="absolute inset-0 size-full overflow-visible">
        <defs>
          <linearGradient id={`${id}s`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="0" y2={h + depth}>
            {dark ? (
              <>
                <stop offset="0" stopColor="#4a4a52" />
                <stop offset="1" stopColor="#000" />
              </>
            ) : (
              <>
                <stop offset="0" stopColor={SLAB_TINT} stopOpacity="0.14" />
                <stop offset="1" stopColor={SLAB_TINT} stopOpacity="0.2" />
              </>
            )}
          </linearGradient>
        </defs>
        <path d={strip} fillRule="evenodd" fill={`url(#${id}s)`} />
        {/* Clear glass gets no outline: a line reads as a border. */}
        {dark && <polygon points={toPoints(slab)} fill="none" stroke="#000" strokeOpacity={0.9} />}
      </svg>

      {/* Glare on the thickness strip. */}
      <div
        ref={slabGlare}
        className="glare-edge"
        style={{ width: w + depth, height: h + depth, clipPath: `path(evenodd, "${strip}")` }}
      />

      {/* Front face */}
      <div className={dark ? "crystal-body-dark" : "crystal-body"} style={{ clipPath: faceClip }} />

      {/* Glare along the face edges (a 3px inner ring). */}
      <div
        ref={edgeGlare}
        className="glare-edge"
        style={{ width: w, height: h, clipPath: `path(evenodd, "${toPath(face)} ${toPath(inset(face, 3))}")` }}
      />

      {interactive && (
        <div className="absolute inset-0 overflow-hidden" style={{ clipPath: faceClip }}>
          <div className="crystal-glint" />
        </div>
      )}

      {/* Light on the face. Strokes are clipped to the face, so only their
          inner half shows. */}
      <svg className="absolute inset-0 size-full overflow-visible">
        <defs>
          <clipPath id={`${id}c`}>
            <polygon points={toPoints(face)} />
          </clipPath>
          {dark ? (
            <>
              {/* Highlight on the lit top-left, gone past the middle. */}
              <linearGradient id={`${id}h`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
                <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
                <stop offset="0.4" stopColor="#fff" stopOpacity="0.15" />
                <stop offset="0.75" stopColor="#fff" stopOpacity="0" />
              </linearGradient>
              <linearGradient id={`${id}p`} gradientUnits="userSpaceOnUse" x1="0" y1="0" x2={w} y2={h}>
                {prismStops(0.08, 0.14, 0.45)}
              </linearGradient>
            </>
          ) : (
            <>
              <filter id={`${id}b`} x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation={GLOW_BLUR} />
              </filter>
              {/* Radial from the top-left corner, so the glow fades at the
                  same rate along the top and the left side. */}
              <radialGradient
                id={`${id}g`}
                gradientUnits="userSpaceOnUse"
                cx="0"
                cy="0"
                r={Math.min(w, h) * GLOW_REACH}
              >
                <stop offset="0" stopColor="#fff" stopOpacity={GLOW_OPACITY} />
                <stop offset="0.45" stopColor="#fff" stopOpacity={GLOW_OPACITY * 0.45} />
                <stop offset="1" stopColor="#fff" stopOpacity="0" />
              </radialGradient>
            </>
          )}
        </defs>

        {dark ? (
          <>
            <g clipPath={`url(#${id}c)`}>
              <polygon points={toPoints(face)} fill="none" stroke={`url(#${id}h)`} strokeWidth="6" />
              <polygon points={toPoints(face)} fill="none" stroke={`url(#${id}p)`} strokeWidth="3" />
            </g>
            <polygon points={toPoints(face)} fill="none" stroke="#fff" strokeOpacity={0.12} />
          </>
        ) : (
          <g clipPath={`url(#${id}c)`}>
            <path
              d={litEdges(face)}
              fill="none"
              stroke={`url(#${id}g)`}
              strokeWidth={GLOW_WIDTH}
              strokeLinecap="round"
              filter={`url(#${id}b)`}
            />
          </g>
        )}
      </svg>
    </div>
  );
}
