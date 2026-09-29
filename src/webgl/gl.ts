// Thin helpers around raw WebGL2 calls. Every function throws on failure so
// the renderer can bail out in one place instead of checking nulls everywhere.

export function createProgram(
  gl: WebGL2RenderingContext,
  vertexSrc: string,
  fragmentSrc: string,
): WebGLProgram {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vertexSrc);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSrc);

  const program = gl.createProgram();
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  // Shaders are copied into the program at link time and can be released.
  gl.deleteShader(vs);
  gl.deleteShader(fs);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const log = gl.getProgramInfoLog(program);
    gl.deleteProgram(program);
    throw new Error(`Program link failed:\n${log ?? ""}`);
  }
  return program;
}

function compileShader(
  gl: WebGL2RenderingContext,
  type: GLenum,
  src: string,
): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("createShader failed");

  gl.shaderSource(shader, src);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(shader);
    gl.deleteShader(shader);
    throw new Error(`Shader compile failed:\n${log ?? ""}`);
  }
  return shader;
}

/** Uploads `data` to a new buffer and wires it to attribute `location`. */
export function bindAttribute(
  gl: WebGL2RenderingContext,
  location: number,
  data: Float32Array,
  componentsPerVertex: number,
) {
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
  gl.enableVertexAttribArray(location);
  gl.vertexAttribPointer(location, componentsPerVertex, gl.FLOAT, false, 0, 0);
}

/**
 * Stores 4 floats per shard in a N×1 float texture. Shaders read a shard's
 * parameters with texelFetch(tex, ivec2(shardIndex, 0), 0).
 */
export function createParamsTexture(
  gl: WebGL2RenderingContext,
  params: Float32Array,
  count: number,
): WebGLTexture {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  // NEAREST: float textures are not filterable without an extension,
  // and we only ever fetch exact texels anyway.
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA32F, count, 1, 0, gl.RGBA, gl.FLOAT, params);
  gl.bindTexture(gl.TEXTURE_2D, null);
  return tex;
}
