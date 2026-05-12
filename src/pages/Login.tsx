import { useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { Shield, Eye, EyeOff } from "lucide-react";

function initLoginShader(canvas: HTMLCanvasElement) {
  const gl = canvas.getContext("webgl2", { alpha: false, antialias: false });
  if (!gl) return null;

  const vert = `
precision highp float;
attribute vec2 a_pos;
void main() {
  gl_Position = vec4(a_pos, 0.0, 1.0);
}
`;

  const frag = `
precision highp float;
uniform float u_time;
uniform vec2 u_res;

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

void main() {
  vec2 uv = (gl_FragCoord.xy - u_res * 0.5) / min(u_res.x, u_res.y);
  float r = length(uv);
  float t = u_time * 0.15;
  float n1 = fbm(uv * 2.0 + vec2(t * 0.3, t * 0.2));
  float n2 = fbm(uv * 1.5 + vec2(-t * 0.2, t * 0.3) + 10.0);
  float n3 = fbm(uv * 3.0 + vec2(t * 0.1, -t * 0.15) + 20.0);
  float light = 0.3 / (r * 6.0 + 0.2);
  light += n1 * 0.08 * smoothstep(0.6, 0.0, r);
  light += n2 * 0.05 * smoothstep(0.8, 0.0, r);
  vec3 color = vec3(0.9, 0.93, 1.0) * light;
  color += vec3(1.0, 0.8, 0.5) * n3 * 0.03 * smoothstep(0.5, 0.0, r);
  color *= (1.0 - r * r * 0.9);
  color *= 0.5;
  gl_FragColor = vec4(color, 1.0);
}
`;

  function compile(type: number, src: string) {
    const s = gl!.createShader(type)!;
    gl!.shaderSource(s, src);
    gl!.compileShader(s);
    return s;
  }

  const prog = gl.createProgram()!;
  gl.attachShader(prog, compile(gl.VERTEX_SHADER, vert));
  gl.attachShader(prog, compile(gl.FRAGMENT_SHADER, frag));
  gl.linkProgram(prog);
  gl.useProgram(prog);

  const buf = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  const aPos = gl.getAttribLocation(prog, "a_pos");
  gl.enableVertexAttribArray(aPos);
  gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

  const uTime = gl.getUniformLocation(prog, "u_time");
  const uRes = gl.getUniformLocation(prog, "u_res");

  let rafId = 0;
  const resize = () => {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = canvas.clientWidth * dpr;
    canvas.height = canvas.clientHeight * dpr;
    gl!.viewport(0, 0, canvas.width, canvas.height);
  };
  window.addEventListener("resize", resize);
  resize();

  const render = (now: number) => {
    gl!.uniform1f(uTime, now * 0.001);
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
    rafId = requestAnimationFrame(render);
  };
  rafId = requestAnimationFrame(render);

  return () => {
    cancelAnimationFrame(rafId);
    window.removeEventListener("resize", resize);
  };
}

export default function Login() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const cleanup = initLoginShader(canvas);
    return cleanup || undefined;
  }, []);

  const handleOAuth = () => {
    const authUrl = new URL(
      (import.meta.env.VITE_KIMI_AUTH_URL as string) || "https://kimi.auth.server/oauth/authorize"
    );
    authUrl.searchParams.set("client_id", (import.meta.env.VITE_APP_ID as string) || "");
    authUrl.searchParams.set("redirect_uri", `${window.location.origin}/api/oauth/callback`);
    authUrl.searchParams.set("response_type", "code");
    authUrl.searchParams.set("scope", "profile");
    authUrl.searchParams.set("state", btoa(window.location.pathname));
    window.location.href = authUrl.toString();
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <canvas
        ref={canvasRef}
        style={{
          position: "fixed",
          inset: 0,
          width: "100vw",
          height: "100vh",
          zIndex: 0,
        }}
      />
      <div
        className="relative flex flex-col items-center px-4"
        style={{ zIndex: 1, width: "100%", maxWidth: 400 }}
      >
        <Link to="/" className="mb-8">
          <span
            className="text-white font-medium"
            style={{ fontSize: "18px", letterSpacing: "0.15em" }}
          >
            KAPTEN
          </span>
        </Link>

        <div
          className="w-full p-8"
          style={{
            background: "rgba(17,17,17,0.6)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--border-subtle)",
          }}
        >
          <div className="flex flex-col items-center mb-8">
            <div
              className="flex items-center justify-center rounded-full mb-4"
              style={{
                width: 56,
                height: 56,
                background: "rgba(255,255,255,0.04)",
                border: "1px solid var(--border-subtle)",
              }}
            >
              <Shield size={24} style={{ color: "rgba(255,255,255,0.6)" }} />
            </div>
            <h1
              className="text-white font-normal"
              style={{ fontSize: "24px", lineHeight: 1.3 }}
            >
              Welcome back
            </h1>
            <p
              className="mt-2 text-center"
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.55)",
              }}
            >
              Sign in to access your vault
            </p>
          </div>

          <button
            onClick={handleOAuth}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-lg text-white font-medium transition-all duration-300 hover:brightness-110"
            style={{
              background: "var(--accent)",
              fontSize: "14px",
            }}
          >
            Continue with OAuth
          </button>

          <div
            className="flex items-center gap-4 my-6"
            style={{ color: "rgba(255,255,255,0.25)" }}
          >
            <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
            <span style={{ fontSize: "12px" }}>or</span>
            <div className="flex-1 h-px" style={{ background: "var(--border-subtle)" }} />
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label
                className="block mb-2"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-lg text-white outline-none transition-all duration-300 focus:border-opacity-50"
                style={{
                  background: "rgba(255,255,255,0.03)",
                  border: "1px solid var(--border-subtle)",
                  fontSize: "14px",
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = "var(--border-active)")
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = "var(--border-subtle)")
                }
              />
            </div>
            <div>
              <label
                className="block mb-2"
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-10 rounded-lg text-white outline-none transition-all duration-300"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                    fontSize: "14px",
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = "var(--border-active)")
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = "var(--border-subtle)")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  style={{ color: "rgba(255,255,255,0.4)" }}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button className="btn-primary w-full py-3" style={{ fontSize: "14px" }}>
              Sign in
            </button>
          </div>
        </div>

        <p
          className="mt-6 text-center"
          style={{ fontSize: "13px", color: "rgba(255,255,255,0.35)" }}
        >
          Don't have an account?{" "}
          <button
            onClick={handleOAuth}
            className="underline transition-colors duration-300 hover:text-white"
            style={{ color: "var(--accent)" }}
          >
            Get started
          </button>
        </p>
      </div>
    </div>
  );
}
