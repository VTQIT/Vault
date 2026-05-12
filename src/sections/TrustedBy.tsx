import { useEffect, useRef } from "react";

const logos = [
  { shape: "circle", svg: <circle cx="20" cy="20" r="14" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
  { shape: "hexagon", svg: <path d="M20 6 L34 14 L34 26 L20 34 L6 26 L6 14 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
  { shape: "triangle", svg: <path d="M20 6 L34 32 L6 32 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
  { shape: "square", svg: <rect x="7" y="7" width="26" height="26" rx="3" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
  { shape: "diamond", svg: <path d="M20 4 L36 20 L20 36 L4 20 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
  { shape: "star", svg: <path d="M20 4 L23.5 14.5 L35 14.5 L25.5 21.5 L29 33 L20 26 L11 33 L14.5 21.5 L5 14.5 L16.5 14.5 Z" fill="none" stroke="currentColor" strokeWidth="1.5" /> },
];

export default function TrustedBy() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add("section-enter-active");
          el.classList.remove("section-enter");
          obs.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    el.classList.add("section-enter");
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      style={{
        background: "var(--bg-void)",
        padding: "120px 0",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div ref={ref} className="flex flex-col items-center px-4">
        <span
          className="font-mono uppercase"
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.08em",
          }}
        >
          BACKED BY LEADING TEAMS
        </span>
        <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 mt-10">
          {logos.map((logo, i) => (
            <svg
              key={i}
              width="40"
              height="40"
              viewBox="0 0 40 40"
              style={{ color: "rgba(255,255,255,0.4)", opacity: 0.4 }}
            >
              {logo.svg}
            </svg>
          ))}
        </div>
      </div>
    </section>
  );
}
