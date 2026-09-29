import earcut from "earcut";

// Converts the <polygon class="shard"> elements of an SVG into GPU-ready
// geometry. Coordinates stay in SVG units (viewBox space, y pointing down);
// the vertex shaders map them to the screen, so the meshes never need to be
// rebuilt on resize.

export type ShardMeshes = {
  /** viewBox width and height, used by the shaders to fit the art to the screen */
  size: [number, number];
  shardCount: number;
  /** Solid glass surfaces: one triangulated polygon per shard. */
  fill: {
    position: Float32Array; // vec2 per vertex
    shard: Float32Array; // shard index per vertex
    indices: Uint32Array;
  };
  /**
   * Outlines: every polygon side becomes a quad (4 vertices, 2 triangles).
   * Vertices sit on the side itself; the shader pushes them outward along
   * `normal` by ±half the line width, so the width is constant in pixels.
   */
  edge: {
    position: Float32Array; // vec2: point on the polygon side
    normal: Float32Array; // vec2: unit normal of that side
    side: Float32Array; // -1 or +1: which way to push along the normal
    along: Float32Array; // 0 at the start of the side, 1 at the end
    shard: Float32Array;
    indices: Uint32Array;
  };
};

export function buildShardMeshes(svgText: string): ShardMeshes {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");
  const svg = doc.querySelector("svg");
  const viewBox = svg?.getAttribute("viewBox")?.trim().split(/\s+/).map(Number);
  if (!viewBox || viewBox.length !== 4) throw new Error("SVG viewBox not found");
  const [vx, vy, vw, vh] = viewBox;

  const polygons = [...doc.querySelectorAll("polygon.shard")];

  const fill = { position: [] as number[], shard: [] as number[], indices: [] as number[] };
  const edge = {
    position: [] as number[],
    normal: [] as number[],
    side: [] as number[],
    along: [] as number[],
    shard: [] as number[],
    indices: [] as number[],
  };

  polygons.forEach((polygon, shardIndex) => {
    const points = parsePoints(polygon.getAttribute("points") ?? "", vx, vy);
    if (points.length < 3) return;

    // Fill: earcut takes a flat [x0, y0, x1, y1, ...] list and returns
    // triangle indices relative to that list.
    const flat = points.flat();
    const base = fill.position.length / 2;
    fill.position.push(...flat);
    for (let i = 0; i < points.length; i++) fill.shard.push(shardIndex);
    for (const i of earcut(flat)) fill.indices.push(base + i);

    // Edges: one quad per side A→B.
    for (let i = 0; i < points.length; i++) {
      const [ax, ay] = points[i];
      const [bx, by] = points[(i + 1) % points.length];
      const len = Math.hypot(bx - ax, by - ay) || 1;
      const nx = -(by - ay) / len;
      const ny = (bx - ax) / len;

      const q = edge.position.length / 2;
      edge.position.push(ax, ay, ax, ay, bx, by, bx, by);
      edge.normal.push(nx, ny, nx, ny, nx, ny, nx, ny);
      edge.side.push(+1, -1, +1, -1);
      edge.along.push(0, 0, 1, 1);
      edge.shard.push(shardIndex, shardIndex, shardIndex, shardIndex);
      edge.indices.push(q, q + 1, q + 2, q + 2, q + 1, q + 3);
    }
  });

  return {
    size: [vw, vh],
    shardCount: polygons.length,
    fill: {
      position: new Float32Array(fill.position),
      shard: new Float32Array(fill.shard),
      indices: new Uint32Array(fill.indices),
    },
    edge: {
      position: new Float32Array(edge.position),
      normal: new Float32Array(edge.normal),
      side: new Float32Array(edge.side),
      along: new Float32Array(edge.along),
      shard: new Float32Array(edge.shard),
      indices: new Uint32Array(edge.indices),
    },
  };
}

/** "x1,y1 x2,y2 ..." → [[x1, y1], ...], shifted so the viewBox starts at 0,0. */
function parsePoints(attr: string, vx: number, vy: number): [number, number][] {
  return attr
    .trim()
    .split(/\s+/)
    .map((pair) => {
      const [x, y] = pair.split(",").map(Number);
      return [x - vx, y - vy] as [number, number];
    })
    .filter(([x, y]) => Number.isFinite(x) && Number.isFinite(y));
}
