import { bindAttribute, createParamsTexture, createProgram } from "./gl";
import { edgeFragment, edgeVertex, fillFragment, fillVertex } from "./shaders";
import { buildShardMeshes } from "./shards";

export type ShardRenderer = {
  /** Target brightness of the whole effect, 0..1. Changes are eased. */
  setIntensity(value: number): void;
  destroy(): void;
};

type Options = {
  svgUrl: string;
  /** Upper bound for devicePixelRatio, trades sharpness for GPU load. */
  maxDpr?: number;
  /** Edge line width in device pixels (4.4 = the original site's value). */
  edgeWidth?: number;
  /** Freeze the animation (prefers-reduced-motion). */
  still?: boolean;
};

/**
 * Draws the animated glass shards into `canvas` until destroy() is called.
 * Throws if WebGL2 is unavailable; the caller should keep a CSS fallback.
 */
export async function createShardRenderer(
  canvas: HTMLCanvasElement,
  { svgUrl, maxDpr = 2, edgeWidth = 4.4, still = false }: Options,
): Promise<ShardRenderer> {
  const gl = canvas.getContext("webgl2", { antialias: true, premultipliedAlpha: false });
  if (!gl) throw new Error("WebGL2 not supported");

  const svgText = await fetch(svgUrl).then((r) => r.text());
  const meshes = buildShardMeshes(svgText);

  const fillProgram = createProgram(gl, fillVertex, fillFragment);
  const edgeProgram = createProgram(gl, edgeVertex, edgeFragment);

  // ---- per-shard random parameters (deterministic, same on every load) ----
  const n = meshes.shardCount;
  const params = new Float32Array(n * 4);
  const rand = (i: number, a: number, b: number, c: number) =>
    fract(Math.sin(i * a + b) * c);
  for (let i = 0; i < n; i++) {
    params[i * 4 + 0] = rand(i, 12.9898, 0.1, 43758.5453); // phase
    params[i * 4 + 1] = 0.85 + rand(i, 78.233, 0.7, 12345.6789) * 0.45; // speed
    params[i * 4 + 2] = 0.65 + rand(i, 41.123, 2.3, 98765.4321) * 0.55; // sparkle
    params[i * 4 + 3] = rand(i, 9.331, 4.7, 54321.1234); // gradient angle
  }
  const paramsTex = createParamsTexture(gl, params, n);

  // ---- geometry: attribute locations match layout(location = N) in shaders ----
  const fillVao = gl.createVertexArray();
  gl.bindVertexArray(fillVao);
  bindAttribute(gl, 0, meshes.fill.position, 2);
  bindAttribute(gl, 1, meshes.fill.shard, 1);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, meshes.fill.indices, gl.STATIC_DRAW);

  const edgeVao = gl.createVertexArray();
  gl.bindVertexArray(edgeVao);
  bindAttribute(gl, 0, meshes.edge.position, 2);
  bindAttribute(gl, 1, meshes.edge.normal, 2);
  bindAttribute(gl, 2, meshes.edge.side, 1);
  bindAttribute(gl, 3, meshes.edge.along, 1);
  bindAttribute(gl, 4, meshes.edge.shard, 1);
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, meshes.edge.indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  const fillU = uniforms(gl, fillProgram, ["uViewport", "uArtSize", "uScale", "uTime", "uIntensity", "uParams"]);
  const edgeU = uniforms(gl, edgeProgram, ["uViewport", "uArtSize", "uScale", "uHalfWidth", "uTime", "uIntensity", "uParams"]);

  // ---- sizing: keep the drawing buffer at CSS size × DPR ----
  let dpr = 1;
  const resize = () => {
    dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
    requestFrame();
  };
  const observer = new ResizeObserver(resize);
  observer.observe(canvas);

  // ---- render loop ----
  let intensity = 0; // fades in from nothing on first load
  let target = 1;
  let raf = 0;
  let last = performance.now();
  const start = last;
  const STILL_TIME = 14; // seconds: a pleasant frozen frame for reduced motion

  function frame(now: number) {
    raf = 0;
    const dt = Math.min(0.1, (now - last) / 1000);
    last = now;

    // Exponential ease toward the target (~0.4 s to settle).
    intensity += (target - intensity) * (1 - Math.exp(-dt * 8));
    const settled = Math.abs(target - intensity) < 0.002;
    if (settled) intensity = target;

    const time = still ? STILL_TIME : (now - start) / 1000;
    draw(time);

    // Animated mode redraws forever; still mode only while easing.
    if (!still || !settled) requestFrame();
  }

  function requestFrame() {
    if (!raf) raf = requestAnimationFrame(frame);
  }

  function draw(time: number) {
    const w = canvas.width;
    const h = canvas.height;
    const [artW, artH] = meshes.size;
    const scale = Math.max(w / artW, h / artH); // "cover"

    gl!.viewport(0, 0, w, h);
    // Opaque white base, exactly like the original site: the glass is
    // blended onto it, so the canvas itself is the page background.
    gl!.clearColor(1, 1, 1, 1);
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.enable(gl!.BLEND);
    gl!.activeTexture(gl!.TEXTURE0);
    gl!.bindTexture(gl!.TEXTURE_2D, paramsTex);

    // Pass 1: translucent glass, regular alpha blending.
    gl!.blendFunc(gl!.SRC_ALPHA, gl!.ONE_MINUS_SRC_ALPHA);
    gl!.useProgram(fillProgram);
    gl!.uniform2f(fillU.uViewport, w, h);
    gl!.uniform2f(fillU.uArtSize, artW, artH);
    gl!.uniform1f(fillU.uScale, scale);
    gl!.uniform1f(fillU.uTime, time);
    gl!.uniform1f(fillU.uIntensity, intensity);
    gl!.uniform1i(fillU.uParams, 0);
    gl!.bindVertexArray(fillVao);
    gl!.drawElements(gl!.TRIANGLES, meshes.fill.indices.length, gl!.UNSIGNED_INT, 0);

    // Pass 2: glowing edges, additive blending so light only adds up.
    gl!.blendFunc(gl!.ONE, gl!.ONE);
    gl!.useProgram(edgeProgram);
    gl!.uniform2f(edgeU.uViewport, w, h);
    gl!.uniform2f(edgeU.uArtSize, artW, artH);
    gl!.uniform1f(edgeU.uScale, scale);
    gl!.uniform1f(edgeU.uHalfWidth, edgeWidth / 2);
    gl!.uniform1f(edgeU.uTime, time);
    gl!.uniform1f(edgeU.uIntensity, intensity);
    gl!.uniform1i(edgeU.uParams, 0);
    gl!.bindVertexArray(edgeVao);
    gl!.drawElements(gl!.TRIANGLES, meshes.edge.indices.length, gl!.UNSIGNED_INT, 0);

    gl!.bindVertexArray(null);
  }

  resize();

  return {
    setIntensity(value) {
      target = Math.max(0, Math.min(1, value));
      requestFrame();
    },
    destroy() {
      cancelAnimationFrame(raf);
      observer.disconnect();
      // The context itself is kept: React may re-run the effect on the same
      // <canvas> (StrictMode), and a lost context could not be reused.
    },
  };
}

function fract(x: number) {
  return x - Math.floor(x);
}

function uniforms<K extends string>(
  gl: WebGL2RenderingContext,
  program: WebGLProgram,
  names: K[],
): Record<K, WebGLUniformLocation | null> {
  const out = {} as Record<K, WebGLUniformLocation | null>;
  for (const name of names) out[name] = gl.getUniformLocation(program, name);
  return out;
}
