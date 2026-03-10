import earcut from "./earcut";

export type Meshes = {
  shardCount: number;
  fill: { pos: Float32Array; shard: Float32Array; indices: Uint32Array };
  edge: {
    pos: Float32Array;
    along: Float32Array;
    side: Float32Array;
    shard: Float32Array;
    indices: Uint32Array;
  };
};

function parsePoints(pointsStr: string): Array<[number, number]> {
  return pointsStr
    .trim()
    .split(/\s+/)
    .map((p) => {
      const [x, y] = p.split(",").map(Number);
      return [x, y] as [number, number];
    });
}

export function buildMeshesFromSVG(svgText: string, canvasH: number): Meshes {
  const doc = new DOMParser().parseFromString(svgText, "image/svg+xml");

  const svg = doc.querySelector("svg");
  if (!svg) throw new Error("SVG root not found");

  const vbAttr = svg.getAttribute("viewBox");
  if (!vbAttr) throw new Error("SVG viewBox not found");

  const vb = vbAttr.trim().split(/\s+/).map(Number);
  const [vx, vy, vw, vh] = vb;

  const polys = [...doc.querySelectorAll("polygon.shard")];
  const shardCount = polys.length;

  const fillPos: number[] = [];
  const fillShard: number[] = [];
  const fillIndices: number[] = [];

  const edgePos: number[] = [];
  const edgeAlong: number[] = [];
  const edgeSide: number[] = [];
  const edgeShard: number[] = [];
  const edgeIndices: number[] = [];

  let fillBase = 0;
  let edgeBase = 0;

  // edge thickness: px -> NDC
  const px = 2.2;
  const wNdc = (px / canvasH) * 2.0;

  for (let si = 0; si < polys.length; si++) {
    const pointsAttr = polys[si].getAttribute("points");
    if (!pointsAttr) continue;

    const pts = parsePoints(pointsAttr);

    // ---- fill (triangulated polygon) ----
    const flat: number[] = [];
    for (const [x, y] of pts) flat.push(x, y);

    const idx = earcut(flat);

    for (let i = 0; i < flat.length; i += 2) {
      const x = ((flat[i] - vx) / vw) * 2 - 1;
      const y = 1 - ((flat[i + 1] - vy) / vh) * 2;
      fillPos.push(x, y);
      fillShard.push(si);
    }

    for (const id of idx) fillIndices.push(fillBase + id);
    fillBase += flat.length / 2;

    // ---- edges (quad strip per segment) ----
    const n = pts.length;
    for (let i = 0; i < n; i++) {
      const A = pts[i];
      const B = pts[(i + 1) % n];

      const ax = ((A[0] - vx) / vw) * 2 - 1;
      const ay = 1 - ((A[1] - vy) / vh) * 2;
      const bx = ((B[0] - vx) / vw) * 2 - 1;
      const by = 1 - ((B[1] - vy) / vh) * 2;

      let tx = bx - ax;
      let ty = by - ay;

      const len = Math.hypot(tx, ty) || 1;
      tx /= len;
      ty /= len;

      const nx = -ty;
      const ny = tx;

      const v0 = [ax + nx * wNdc, ay + ny * wNdc];
      const v1 = [ax - nx * wNdc, ay - ny * wNdc];
      const v2 = [bx + nx * wNdc, by + ny * wNdc];
      const v3 = [bx - nx * wNdc, by - ny * wNdc];

      edgePos.push(v0[0], v0[1], v1[0], v1[1], v2[0], v2[1], v3[0], v3[1]);

      edgeAlong.push(0, 0, 1, 1);
      edgeSide.push(+1, -1, +1, -1);
      edgeShard.push(si, si, si, si);

      edgeIndices.push(
        edgeBase + 0,
        edgeBase + 1,
        edgeBase + 2,
        edgeBase + 2,
        edgeBase + 1,
        edgeBase + 3,
      );

      edgeBase += 4;
    }
  }

  return {
    shardCount,
    fill: {
      pos: new Float32Array(fillPos),
      shard: new Float32Array(fillShard),
      indices: new Uint32Array(fillIndices),
    },
    edge: {
      pos: new Float32Array(edgePos),
      along: new Float32Array(edgeAlong),
      side: new Float32Array(edgeSide),
      shard: new Float32Array(edgeShard),
      indices: new Uint32Array(edgeIndices),
    },
  };
}
