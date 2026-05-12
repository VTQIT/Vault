import { useEffect, useRef } from "react";
import { Shield, Zap, Users } from "lucide-react";

const features = [
  {
    icon: Shield,
    title: "Military-grade encryption",
    description:
      "AES-256 encryption at rest and TLS 1.3 in transit. Your data is scrambled before it leaves your device — we couldn't read it if we wanted to.",
  },
  {
    icon: Zap,
    title: "Instant sync across devices",
    description:
      "Changes propagate in under 100ms. Start on your phone, finish on your laptop, present from the tablet.",
  },
  {
    icon: Users,
    title: "Built for collaboration",
    description:
      "Share vaults with precise permissions. Comment, annotate, and version-control together without the chaos.",
  },
];

export default function Features() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const children = el.querySelectorAll("[data-animate]");
    children.forEach((c) => {
      (c as HTMLElement).style.opacity = "0";
      (c as HTMLElement).style.transform = "translateY(24px)";
    });
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          children.forEach((c, i) => {
            setTimeout(() => {
              const h = c as HTMLElement;
              h.style.transition =
                "opacity 0.6s cubic-bezier(0.4,0,0.2,1), transform 0.6s cubic-bezier(0.4,0,0.2,1)";
              h.style.opacity = "1";
              h.style.transform = "translateY(0)";
            }, i * 100);
          });
          obs.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="features"
      style={{
        background: "var(--bg-surface)",
        padding: "120px 24px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div ref={ref} className="max-w-[1080px] mx-auto">
        <span
          data-animate
          className="font-mono uppercase block"
          style={{
            fontSize: "12px",
            color: "rgba(255,255,255,0.25)",
            letterSpacing: "0.06em",
          }}
        >
          Why Kapten
        </span>
        <h2
          data-animate
          className="mt-4 text-white font-normal"
          style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
            maxWidth: 640,
          }}
        >
          Built for how you actually work
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mt-20">
          {features.map((f, i) => (
            <div key={i} data-animate>
              <div
                className="flex items-center justify-center"
                style={{
                  width: 40,
                  height: 40,
                  color: "rgba(255,255,255,0.6)",
                }}
              >
                <f.icon size={28} strokeWidth={1.5} />
              </div>
              <h3
                className="mt-6 text-white font-medium"
                style={{ fontSize: "18px" }}
              >
                {f.title}
              </h3>
              <p
                className="mt-3"
                style={{
                  fontSize: "15px",
                  lineHeight: 1.6,
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
