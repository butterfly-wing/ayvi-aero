// GLSL sources for the two passes: glass fill, then glowing edges.
//
// Shared placement: shard geometry is in SVG units. It is scaled uniformly
// so the artwork *covers* the canvas (like CSS `object-fit: cover`) and is
// centered; anything that falls outside is cropped. This keeps the shards'
// proportions on every screen ratio, from phones to ultrawide monitors.

const placement = /* glsl */ `
uniform vec2 uViewport; // canvas size, device pixels
uniform vec2 uArtSize;  // SVG viewBox size
uniform float uScale;   // device pixels per SVG unit

vec2 artToPixels(vec2 p) {
  return (p - uArtSize * 0.5) * uScale + uViewport * 0.5;
}

// Pixels (y down) -> clip space (-1..1, y up)
vec2 pixelsToClip(vec2 px) {
  vec2 c = px / uViewport * 2.0 - 1.0;
  return vec2(c.x, -c.y);
}
`;

export const fillVertex = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
layout(location = 1) in float aShard;
${placement}
out vec2 vClip;
flat out int vShard;

void main() {
  vClip = pixelsToClip(artToPixels(aPos));
  vShard = int(aShard + 0.5);
  gl_Position = vec4(vClip, 0.0, 1.0);
}`;

export const fillFragment = /* glsl */ `#version 300 es
precision highp float;
in vec2 vClip;
flat in int vShard;
out vec4 outColor;

uniform float uTime;
uniform float uIntensity;   // 0..1, set per scene
uniform sampler2D uParams;  // per shard: phase, speed, sparkle, gradient angle

// Glass palette (blue steel)
const vec3 C0 = vec3(0.494, 0.600, 0.776); // #7E99C6
const vec3 C1 = vec3(0.420, 0.525, 0.725); // #6B86B9
const vec3 C2 = vec3(0.533, 0.639, 0.816); // #88A3D0
const vec3 C3 = vec3(0.349, 0.463, 0.678); // #5976AD

float hash(float x) { return fract(sin(x * 12.9898 + 78.233) * 43758.5453); }

// Linear 4-stop gradient across the screen, rotated per shard so
// neighbouring shards catch the light differently.
vec3 glassGradient(vec2 p, float angle01) {
  float a = angle01 * 6.2831853;
  float t = clamp(dot(p * 0.5, vec2(cos(a), sin(a))) + 0.5, 0.0, 1.0);
  if (t < 0.35) return mix(C0, C1, t / 0.35);
  if (t < 0.60) return mix(C1, C2, (t - 0.35) / 0.25);
  return mix(C2, C3, (t - 0.60) / 0.40);
}

// Key light from the left, slightly from the top.
float keyLight(vec2 p) {
  float lx = 1.0 - smoothstep(-1.0, 1.0, p.x);
  float ly = 0.90 + 0.10 * (1.0 - smoothstep(-1.0, 1.0, p.y));
  return (0.72 + 0.28 * lx) * ly;
}

// Soft travelling rainbow, mixed mostly toward white.
vec3 iridescence(vec2 p, float t, float phase) {
  float w = (p.x * 1.05 + p.y * 0.95) * 2.4 + t * 0.55 + phase * 6.2831853;
  float a = 0.5 + 0.5 * sin(w);
  vec3 rainbow = 0.5 + 0.5 * sin(6.2831853 * (a + vec3(0.0, 0.33, 0.66)));
  return mix(vec3(1.0), rainbow, 0.28);
}

void main() {
  vec4 P = texelFetch(uParams, ivec2(vShard, 0), 0);
  float id = float(vShard);

  vec3 col = glassGradient(vClip, fract(P.w + hash(id)));
  col *= 0.97 + 0.06 * (hash(id * 3.1) - 0.5); // tiny per-shard tint variation
  col *= keyLight(vClip);
  col += iridescence(vClip, uTime * P.y, P.x) * (0.028 * P.z) * uIntensity;

  float alpha = clamp(0.26 + 0.05 * (hash(id * 9.7) - 0.5), 0.20, 0.30);
  outColor = vec4(col, alpha * uIntensity);
}`;

export const edgeVertex = /* glsl */ `#version 300 es
precision highp float;
layout(location = 0) in vec2 aPos;
layout(location = 1) in vec2 aNormal;
layout(location = 2) in float aSide;
layout(location = 3) in float aAlong;
layout(location = 4) in float aShard;
${placement}
uniform float uHalfWidth; // half line width, device pixels
out vec2 vClip;
out float vSide;
out float vAlong;
flat out int vShard;

void main() {
  vec2 px = artToPixels(aPos) + aNormal * aSide * uHalfWidth;
  vClip = pixelsToClip(px);
  vSide = aSide;
  vAlong = aAlong;
  vShard = int(aShard + 0.5);
  gl_Position = vec4(vClip, 0.0, 1.0);
}`;

export const edgeFragment = /* glsl */ `#version 300 es
precision highp float;
in vec2 vClip;
in float vSide;
in float vAlong;
flat in int vShard;
out vec4 outColor;

uniform float uTime;
uniform float uIntensity;
uniform sampler2D uParams;

// A bright band that slides along each edge.
float travellingGlint(float along, float t, float phase) {
  float head = fract(t * 0.12 + phase);
  return smoothstep(0.18, 0.0, abs(along - head));
}

// A large soft spotlight orbiting the screen; edges only glow inside it.
float orbitingSpot(vec2 p, float t, float phase) {
  vec2 center = vec2(-0.10, 0.10) + 1.35 * vec2(cos(t * 0.25 + phase), sin(t * 0.25 + phase));
  return smoothstep(0.70, 0.0, length(p - center));
}

void main() {
  vec4 P = texelFetch(uParams, ivec2(vShard, 0), 0);
  float phase = P.x;

  float k = smoothstep(1.0, 0.0, abs(vSide));          // fade across the line width
  k *= travellingGlint(vAlong, uTime * P.y, phase);
  k *= orbitingSpot(vClip, uTime, phase);
  k *= 0.55 + 0.45 * (1.0 - smoothstep(-1.0, 1.0, vClip.x)); // brighter on the left
  k *= 0.75 + 0.25 * sin(uTime * 1.5 + phase * 6.2831853);   // slow shimmer
  k *= uIntensity;

  const vec3 GOLD = vec3(1.0, 0.92, 0.72);
  outColor = vec4(GOLD * k * (0.9 + 0.2 * P.z), k); // drawn with additive blending
}`;
