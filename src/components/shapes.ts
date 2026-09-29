// Crystal outlines. Each function receives the element size in pixels and
// returns polygon points, so cuts keep a fixed size at any width.

export type ShapeFn = (w: number, h: number) => [number, number][];

/** Rectangle with a large cut top-left and a small cut bottom-right. */
export const panelShape =
  (big = 34, small = 16): ShapeFn =>
  (w, h) => [
    [big, 0],
    [w, 0],
    [w, h - small],
    [w - small, h],
    [0, h],
    [0, big],
  ];

/** Elongated hexagon with pointed ends, for buttons and tags. */
export const hexShape: ShapeFn = (w, h) => {
  const t = Math.min(h * 0.42, w / 4);
  return [
    [t, 0],
    [w - t, 0],
    [w, h / 2],
    [w - t, h],
    [t, h],
    [0, h / 2],
  ];
};

/**
 * Outline of the shape extruded by `depth` pixels toward the bottom-right:
 * the convex hull of the shape and a shifted copy of it. The strip between
 * this outline and the shape itself is the visible thickness of the glass.
 * (All shapes here are convex, so the hull is exact.)
 */
export function extrude(pts: [number, number][], depth: number): [number, number][] {
  const all = [...pts, ...pts.map(([x, y]) => [x + depth, y + depth] as [number, number])];
  return convexHull(all);
}

/** Andrew's monotone chain; returns the hull in clockwise screen order. */
function convexHull(points: [number, number][]): [number, number][] {
  const p = [...points].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const cross = (o: number[], a: number[], b: number[]) =>
    (a[0] - o[0]) * (b[1] - o[1]) - (a[1] - o[1]) * (b[0] - o[0]);
  const lower: [number, number][] = [];
  for (const pt of p) {
    while (lower.length >= 2 && cross(lower[lower.length - 2], lower[lower.length - 1], pt) <= 0) lower.pop();
    lower.push(pt);
  }
  const upper: [number, number][] = [];
  for (const pt of p.reverse()) {
    while (upper.length >= 2 && cross(upper[upper.length - 2], upper[upper.length - 1], pt) <= 0) upper.pop();
    upper.push(pt);
  }
  return lower.slice(0, -1).concat(upper.slice(0, -1));
}

/**
 * The same convex polygon shrunk inward by `d` pixels: every side moves
 * inward along its normal, and each new corner is where two neighbouring
 * moved sides meet. Points must be in clockwise screen order (as all shapes
 * here are).
 */
export function inset(pts: [number, number][], d: number): [number, number][] {
  const n = pts.length;
  // Each side as a point on the moved line + its direction.
  const lines = pts.map(([x1, y1], i) => {
    const [x2, y2] = pts[(i + 1) % n];
    const len = Math.hypot(x2 - x1, y2 - y1) || 1;
    const dx = (x2 - x1) / len;
    const dy = (y2 - y1) / len;
    // Clockwise on screen (y down): the inside is on the right, normal (-dy, dx).
    return { x: x1 - dy * d, y: y1 + dx * d, dx, dy };
  });
  return lines.map((a, i) => {
    const b = lines[(i + n - 1) % n]; // previous side
    const det = a.dx * b.dy - a.dy * b.dx;
    if (Math.abs(det) < 1e-9) return [a.x, a.y] as [number, number];
    const t = ((b.x - a.x) * b.dy - (b.y - a.y) * b.dx) / det;
    return [a.x + a.dx * t, a.y + a.dy * t] as [number, number];
  });
}
