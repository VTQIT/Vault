import { useEffect, useRef } from "react";

const VERTEX_SHADER = `
precision highp float;
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

const FRAGMENT_SHADER = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;
uniform vec2 u_mouse;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

float fbm(vec2 p) {
  float sum = 0.0;
  float amp = 0.5;
  float freq = 1.0;
  for (int i = 0; i < 4; i++) {
    sum += amp * noise(p * freq);
    amp *= 0.5;
    freq *= 2.0;
  }
  return sum;
}

vec2 curl(vec2 p, float t) {
  float scale = 3.0;
  float n1 = fbm(p * scale + vec2(t * 0.2, t * 0.15));
  float n2 = fbm(p * scale * 1.3 + vec2(t * 0.15, -t * 0.2) + 50.0);
  float n3 = fbm(p * scale * 0.7 + vec2(-t * 0.1, t * 0.1) + 100.0);
  return vec2(n1 - n2, n2 - n3) * 0.8;
}

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float r = length(uv);

  float mouseAngle = 0.0;
  if (u_mouse.x > 0.0) {
    vec2 mUV = (u_mouse - u_res * 0.5) / min(u_res.x, u_res.y);
    mouseAngle = atan(mUV.y, mUV.x);
  }

  float t = u_time * 0.3;
  float light = 1.0 / (r * 5.0 + 0.1);

  float hueShift = sin(r * 3.0 - t * 2.0) * 0.5 + 0.5;
  hueShift = pow(hueShift, 3.0);

  float angle = atan(uv.y, uv.x);

  vec3 tendrils = vec3(0.0);
  int numTendrils = 6;
  float tendrilBrightness = 0.0;

  for (int i = 0; i < 6; i++) {
    float fi = float(i);
    float tendrilAngle = angle + fi * 1.047;
    vec2 curlUV = vec2(cos(tendrilAngle), sin(tendrilAngle)) * r;
    curlUV += vec2(cos(mouseAngle), sin(mouseAngle)) * 0.1 * r;
    vec2 c = curl(curlUV, t + fi * 0.5);
    vec2 displaced = vec2(cos(tendrilAngle + c.x), sin(tendrilAngle + c.y)) * r;
    float tendril = smoothstep(0.05, 0.0, abs(displaced.x - displaced.y));
    tendril *= smoothstep(0.8, 0.0, r);
    tendril *= 0.5 + 0.5 * sin(angle * 3.0 + fi * 0.7 + t);
    tendrilBrightness += tendril;
    tendrils += vec3(0.9, 0.95, 1.0) * tendril * (0.5 + 0.5 * sin(fi + t));
  }

  tendrilBrightness *= 0.25;

  vec3 color = vec3(0.95, 0.97, 1.0) * light;
  color += vec3(1.0, 0.85, 0.6) * hueShift * light * 0.5;
  color += tendrils * 0.3;

  float tendrilGlow = tendrilBrightness * smoothstep(0.6, 0.0, r) * 0.3;
  color += vec3(0.8, 0.9, 1.0) * tendrilGlow;

  color *= (1.0 - r * r * 0.8);
  color = pow(color, vec3(0.9 + sin(t) * 0.1));
  color *= 0.7;

  gl_FragColor = vec4(color, 1.0);
}
`;

function initLightTendrils(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
  if (!gl) return null;

  function compile(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return s;
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, VERTEX_SHADER));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, FRAGMENT_SHADER));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Float32Array([-1, -1, 3, -1, -1, 3]),
    gl.STATIC_DRAW
  );

  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, "u_time");
  const uRes = gl.getUniformLocation(prog, "u_res");
  const uMouse = gl.getUniformLocation(prog, "u_mouse");

  let mouseX = 0.0;
  let mouseY = 0.0;
  let rafId = 0;

  const handleMouseMove = (e: MouseEvent) => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    mouseX = e.clientX * dpr;
    mouseY = (canvas.clientHeight - e.clientY) * dpr;
  };

  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl!.viewport(0, 0, canvas.width, canvas.height);
  };

  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("resize", resize);
  resize();

  const render = (now: number) => {
    gl!.uniform1f(uTime, now * 0.001);
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.uniform2f(uMouse, mouseX, mouseY);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(render);
  };

  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("resize", resize);
  };
}

export default function LightTendrils() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = initLightTendrils(canvas);
    return cleanup || undefined;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}
