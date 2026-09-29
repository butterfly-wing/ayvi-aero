// One large glare shared by every crystal on the page.
//
// The glare is a pale golden streak of light with a short rainbow trail,
// defined in *screen* coordinates, that slowly crosses the whole viewport
// diagonally from the bottom-right to the top-left (once every 90 s). Each
// crystal shows it only on its edges and glass thickness, so it looks like
// one light passing over all the glass at once.
//
// How: every glare layer has the same huge background gradient (see
// .glare-edge in index.css). Each frame we move that background so the band
// sits at the right place on screen, compensating for the layer's own
// position with getBoundingClientRect(). One requestAnimationFrame loop
// serves all layers.

const CYCLE_MS = 90_000; // one full cycle
// Where in the cycle the page starts, so the first pass shows up within a
// few seconds of loading instead of after up to a minute and a half.
const START_AT = 0.2;
const SWEEP = 0.7; // fraction of the cycle during which the band is crossing

const STILL_POSITION = 0.38; // where the streak rests with reduced motion

const layers = new Set<HTMLElement>();
let raf = 0;

const reducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function frame(now: number) {
  if (reducedMotion()) {
    // No animation: draw the streak once at a fixed spot. Redrawn on
    // resize and whenever a layer is added (see below).
    raf = 0;
    place(STILL_POSITION);
    return;
  }
  raf = requestAnimationFrame(frame);

  const t = ((now + START_AT * CYCLE_MS) % CYCLE_MS) / CYCLE_MS;
  // From beyond the bottom-right corner to beyond the top-left during the
  // sweep, then parked off-screen until the next cycle.
  place(t < SWEEP ? 1 - easeInOut(t / SWEEP) : 0);
}

/** Positions the streak at progress p (0 = off top-left, 1 = off bottom-right). */
function place(p: number) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const cx = -0.6 * W + p * 2.2 * W;
  const cy = -0.6 * H + p * 2.2 * H;

  // The gradient image is 3W × 3H with the band in its centre.
  const bgX = cx - 1.5 * W;
  const bgY = cy - 1.5 * H;

  for (const el of layers) {
    // Hidden scenes stay mounted (inert, transparent): moving their glare
    // would repaint them every frame for nothing.
    if (el.closest("[inert]")) continue;
    const r = el.getBoundingClientRect();
    if (r.bottom < 0 || r.top > H || r.right < 0 || r.left > W) continue;
    el.style.backgroundPosition = `${bgX - r.left}px ${bgY - r.top}px`;
  }
}

window.addEventListener("resize", () => {
  if (!raf && layers.size) raf = requestAnimationFrame(frame);
});

function easeInOut(x: number) {
  return x < 0.5 ? 2 * x * x : 1 - (-2 * x + 2) ** 2 / 2;
}

/** Adds a layer to the shared glare. Returns the function that removes it. */
export function registerGlareLayer(el: HTMLElement): () => void {
  layers.add(el);
  if (!raf) raf = requestAnimationFrame(frame);
  return () => {
    layers.delete(el);
    if (layers.size === 0) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}
