import { createProgram, createTextureRGBA32F } from "./gl";
import { buildMeshesFromSVG } from "./svg";

export type SceneId =
  | "scene1"
  | "scene2"
  | "scene3"
  | "scene4"
  | "scene5"
  | "scene6"
  | "scene7";

type StartOpts = { svgUrl: string; scene: SceneId | string; dpr: number };

const SCENES: Record<
  SceneId,
  {
    drawShards: boolean;
    opacity: number;
    edgesScale: number;
    rainbowScale: number;
  }
> = {
  scene1: {
    drawShards: true,
    opacity: 1.0,
    edgesScale: 1.0,
    rainbowScale: 1.0,
  },
  scene2: {
    drawShards: true,
    opacity: 0.35,
    edgesScale: 0.35,
    rainbowScale: 0.35,
  },
  scene3: {
    drawShards: true,
    opacity: 0.3,
    edgesScale: 0.3,
    rainbowScale: 0.3,
  },
  scene4: {
    drawShards: true,
    opacity: 0.25,
    edgesScale: 0.25,
    rainbowScale: 0.25,
  },
  scene5: {
    drawShards: true,
    opacity: 0.2,
    edgesScale: 0.2,
    rainbowScale: 0.2,
  },
  scene6: {
    drawShards: true,
    opacity: 0.28,
    edgesScale: 0.25,
    rainbowScale: 0.25,
  },
  scene7: {
    drawShards: true,
    opacity: 0.28,
    edgesScale: 0.25,
    rainbowScale: 0.25,
  },
};

type SceneCfg = (typeof SCENES)[SceneId];

function getSceneCfg(scene: string): SceneCfg {
  return (
    (SCENES as unknown as Record<string, SceneCfg>)[scene] ?? SCENES.scene1
  );
}

export async function startWebGL(canvas: HTMLCanvasElement, opts: StartOpts) {
  const gl0 = canvas.getContext("webgl2", {
    antialias: true,
    premultipliedAlpha: false,
  });
  if (!gl0) throw new Error("WebGL2 not supported");

  const gl: WebGL2RenderingContext = gl0;

  gl.clearColor(1, 1, 1, 1);
  gl.getExtension("EXT_color_buffer_float");

  const sceneCfg = getSceneCfg(String(opts.scene));

  // ---------- resize ----------
  const resize = () => {
    const rect = canvas.getBoundingClientRect();
    if (rect.width < 2 || rect.height < 2) return;

    const dpr = opts.dpr;
    const w = Math.max(1, Math.floor(rect.width * dpr));
    const h = Math.max(1, Math.floor(rect.height * dpr));

    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl.viewport(0, 0, w, h);
    }
  };

  requestAnimationFrame(() => resize());
  const onResize = () => resize();
  window.addEventListener("resize", onResize);

  // ---------- shaders ----------
  const vsFill = `#version 300 es
  precision highp float;
  layout(location=0) in vec2 aPos;
  layout(location=1) in float aShard;
  out vec2 vPos;
  flat out int vShard;
  void main() {
    vPos = aPos;
    vShard = int(aShard + 0.5);
    gl_Position = vec4(aPos, 0.0, 1.0);
  }`;

  const fsFill = `#version 300 es
  precision highp float;
  in vec2 vPos;
  flat in int vShard;
  out vec4 outColor;

  uniform float uTime;
  uniform sampler2D uShardTex; // phase, speed, intensity, angleSeed
  uniform float uGlobalOpacity;
  uniform float uRainbowScale;

  // базовые цвета (из фигмы)
  vec3 c0 = vec3(0.494, 0.600, 0.776); // #7E99C6
  vec3 c1 = vec3(0.420, 0.525, 0.725); // #6B86B9
  vec3 c2 = vec3(0.533, 0.639, 0.816); // #88A3D0
  vec3 c3 = vec3(0.349, 0.463, 0.678); // #5976AD

  float hash1(float x){ return fract(sin(x*12.9898 + 78.233) * 43758.5453); }

  vec3 figmaLikeGradient(vec2 p, float angle01) {
    vec2 uv = p * 0.5 + 0.5;
    float ang = angle01 * 6.2831853;
    vec2 dir = normalize(vec2(cos(ang), sin(ang)));
    float t = clamp(dot(uv - 0.5, dir) + 0.5, 0.0, 1.0);

    if (t < 0.35) return mix(c0, c1, t / 0.35);
    if (t < 0.60) return mix(c1, c2, (t - 0.35) / 0.25);
    return mix(c2, c3, (t - 0.60) / 0.40);
  }

  float mainLight(vec2 p) {
    float lx = 1.0 - smoothstep(-1.0, 1.0, p.x);
    float ly = 0.90 + 0.10 * (1.0 - smoothstep(-1.0, 1.0, p.y));
    return (0.72 + 0.28 * lx) * ly;
  }

  vec3 pastelRainbow(vec2 p, float t, float phase) {
    float w = (p.x*1.05 + p.y*0.95) * 2.4 + t*0.55 + phase*6.283;
    float a = 0.5 + 0.5 * sin(w);
    vec3 r = vec3(
      0.5 + 0.5*sin(6.283*(a + 0.00)),
      0.5 + 0.5*sin(6.283*(a + 0.33)),
      0.5 + 0.5*sin(6.283*(a + 0.66))
    );
    return mix(vec3(1.0), r, 0.28);
  }

  void main() {
    vec4 P = texelFetch(uShardTex, ivec2(vShard, 0), 0);
    float phase = P.x;
    float speed = P.y;
    float intensity = P.z;
    float angSeed = P.w;

    float angle01 = fract(angSeed + hash1(float(vShard)));

    vec3 col = figmaLikeGradient(vPos, angle01);

    // микро-неоднородность
    col *= 0.97 + 0.06*(hash1(float(vShard)*3.1) - 0.5);

    // общий свет слева
    col *= mainLight(vPos);

    // радуга (сцена контролирует силу)
    vec3 rb = pastelRainbow(vPos, uTime * speed, phase);
    col += rb * (0.028 * intensity) * uRainbowScale;

    // альфа стекла (как в фигме) * глобальная прозрачность сцены
    float a = clamp(0.26 + 0.05*(hash1(float(vShard)*9.7) - 0.5), 0.20, 0.30);
    a *= uGlobalOpacity;

    outColor = vec4(col, a);
  }`;

  const vsEdge = `#version 300 es
  precision highp float;
  layout(location=0) in vec2 aPos;
  layout(location=1) in float aAlong;
  layout(location=2) in float aSide;
  layout(location=3) in float aShard;
  out vec2 vPos;
  out float vAlong;
  out float vSide;
  flat out int vShard;
  void main() {
    vPos = aPos;
    vAlong = aAlong;
    vSide = aSide;
    vShard = int(aShard + 0.5);
    gl_Position = vec4(aPos, 0.0, 1.0);
  }`;

  const fsEdge = `#version 300 es
  precision highp float;
  in vec2 vPos;
  in float vAlong;
  in float vSide;
  flat in int vShard;
  out vec4 outColor;

  uniform float uTime;
  uniform sampler2D uShardTex;
  uniform float uEdgeScale;
  uniform float uGlobalOpacity;

  float edgeProfile(float side) { return smoothstep(1.0, 0.0, abs(side)); }
  float movingBand(float along, float t, float phase) {
    float p = fract(t*0.12 + phase);
    return smoothstep(0.18, 0.0, abs(along - p));
  }
  float circularField(vec2 p, float t, float phase) {
    vec2 c = vec2(-0.10, 0.10);
    float r = 1.35;
    vec2 lp = c + r * vec2(cos(t*0.25 + phase), sin(t*0.25 + phase));
    return smoothstep(0.70, 0.0, length(p - lp));
  }
  float leftLight(vec2 p) { return 0.55 + 0.45 * (1.0 - smoothstep(-1.0, 1.0, p.x)); }

  void main() {
    vec4 P = texelFetch(uShardTex, ivec2(vShard, 0), 0);
    float phase = P.x;
    float speed = P.y;
    float intensity = P.z;

    float k = edgeProfile(vSide);
    k *= movingBand(vAlong, uTime*speed, phase);
    k *= circularField(vPos, uTime, phase);
    k *= leftLight(vPos);
    k *= 0.75 + 0.25*sin(uTime*1.5 + phase*6.283);

    k *= uEdgeScale;
    k *= uGlobalOpacity;

    vec3 gold = vec3(1.0, 0.92, 0.72);
    outColor = vec4(gold * (k * (0.9 + 0.2*intensity)), k);
  }`;

  const progFill = createProgram(gl, vsFill, fsFill);
  const progEdge = createProgram(gl, vsEdge, fsEdge);

  // ---------- load svg + meshes ----------
  const svgText = await (await fetch(opts.svgUrl)).text();
  const meshes = buildMeshesFromSVG(svgText, canvas.height);

  // ---------- shard params texture ----------
  const N = meshes.shardCount;
  const params = new Float32Array(N * 4);
  const fract = (x: number) => x - Math.floor(x);

  for (let i = 0; i < N; i++) {
    const r1 = fract(Math.sin(i * 12.9898 + 0.1) * 43758.5453);
    const r2 = fract(Math.sin(i * 78.233 + 0.7) * 12345.6789);
    const r3 = fract(Math.sin(i * 41.123 + 2.3) * 98765.4321);
    const r4 = fract(Math.sin(i * 9.331 + 4.7) * 54321.1234);
    params[i * 4 + 0] = r1;
    params[i * 4 + 1] = 0.85 + r2 * 0.45;
    params[i * 4 + 2] = 0.65 + r3 * 0.55;
    params[i * 4 + 3] = r4;
  }

  const shardTex = createTextureRGBA32F(gl, N, 1, params);

  // ---------- VAOs ----------
  const vaoFill = gl.createVertexArray()!;
  gl.bindVertexArray(vaoFill);
  bindVBO(gl, meshes.fill.pos, 0, 2);
  bindVBO(gl, meshes.fill.shard, 1, 1);
  const iboFill = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboFill);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, meshes.fill.indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  const vaoEdge = gl.createVertexArray()!;
  gl.bindVertexArray(vaoEdge);
  bindVBO(gl, meshes.edge.pos, 0, 2);
  bindVBO(gl, meshes.edge.along, 1, 1);
  bindVBO(gl, meshes.edge.side, 2, 1);
  bindVBO(gl, meshes.edge.shard, 3, 1);
  const iboEdge = gl.createBuffer()!;
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iboEdge);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, meshes.edge.indices, gl.STATIC_DRAW);
  gl.bindVertexArray(null);

  // ---------- cache uniforms ----------
  const uFillShardTex = gl.getUniformLocation(progFill, "uShardTex");
  const uFillTime = gl.getUniformLocation(progFill, "uTime");
  const uFillOpacity = gl.getUniformLocation(progFill, "uGlobalOpacity");
  const uFillRainbow = gl.getUniformLocation(progFill, "uRainbowScale");

  const uEdgeShardTex = gl.getUniformLocation(progEdge, "uShardTex");
  const uEdgeTime = gl.getUniformLocation(progEdge, "uTime");
  const uEdgeScale = gl.getUniformLocation(progEdge, "uEdgeScale");
  const uEdgeOpacity = gl.getUniformLocation(progEdge, "uGlobalOpacity");

  // ---------- render loop ----------
  let raf = 0;
  const t0 = performance.now();

  function draw(now: number) {
    gl.clear(gl.COLOR_BUFFER_BIT);

    if (sceneCfg.drawShards) {
      const t = (now - t0) / 1000;

      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

      gl.useProgram(progFill);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, shardTex);

      if (uFillShardTex) gl.uniform1i(uFillShardTex, 0);
      if (uFillTime) gl.uniform1f(uFillTime, t);
      if (uFillOpacity) gl.uniform1f(uFillOpacity, sceneCfg.opacity);
      if (uFillRainbow) gl.uniform1f(uFillRainbow, sceneCfg.rainbowScale);

      gl.bindVertexArray(vaoFill);
      gl.drawElements(
        gl.TRIANGLES,
        meshes.fill.indices.length,
        gl.UNSIGNED_INT,
        0,
      );

      // edges
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.ONE, gl.ONE);

      gl.useProgram(progEdge);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, shardTex);

      if (uEdgeShardTex) gl.uniform1i(uEdgeShardTex, 0);
      if (uEdgeTime) gl.uniform1f(uEdgeTime, t);
      if (uEdgeScale) gl.uniform1f(uEdgeScale, sceneCfg.edgesScale);
      if (uEdgeOpacity) gl.uniform1f(uEdgeOpacity, sceneCfg.opacity);

      gl.bindVertexArray(vaoEdge);
      gl.drawElements(
        gl.TRIANGLES,
        meshes.edge.indices.length,
        gl.UNSIGNED_INT,
        0,
      );
    }

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);

  return () => {
    cancelAnimationFrame(raf);
    window.removeEventListener("resize", onResize);
  };
}

function bindVBO(
  gl: WebGL2RenderingContext,
  data: Float32Array,
  loc: number,
  size: number,
) {
  const b = gl.createBuffer()!;
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
}
