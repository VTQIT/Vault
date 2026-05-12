import { useEffect, useRef } from "react";
import { Check } from "lucide-react";

const freeFeatures = [
  "Up to 1,000 items",
  "3 shared vaults",
  "7-day version history",
  "Community support",
  "Basic search",
];

const proFeatures = [
  "Unlimited items",
  "Unlimited vaults",
  "Unlimited version history",
  "Priority support",
  "Advanced search & filters",
  "Custom domains",
  "API access",
];

export default function Pricing() {
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
      id="pricing"
      style={{
        background: "var(--bg-surface)",
        padding: "120px 24px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div ref={ref} className="max-w-[800px] mx-auto flex flex-col items-center">
        <h2
          data-animate
          className="text-white font-normal text-center"
          style={{
            fontSize: "clamp(28px, 3vw, 36px)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          Simple pricing
        </h2>
        <p
          data-animate
          className="mt-3 text-center"
          style={{
            fontSize: "16px",
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Start free. Scale when you need to.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16 w-full max-w-[720px]">
          <div
            data-animate
            className="glass-card p-8 md:p-10"
          >
            <h3
              className="text-white font-medium"
              style={{ fontSize: "24px" }}
            >
              Free
            </h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span
                className="text-white font-light"
                style={{ fontSize: "48px", lineHeight: 1 }}
              >
                $0
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                /month
              </span>
            </div>
            <ul className="flex flex-col gap-3 mt-8">
              {freeFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check
                    size={16}
                    style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <button className="btn-outline w-full mt-8">Get started</button>
          </div>

          <div
            data-animate
            className="glass-card p-8 md:p-10 relative"
            style={{
              borderColor: "rgba(255,107,44,0.4)",
              background:
                "linear-gradient(135deg, rgba(255,107,44,0.04) 0%, transparent 60%), rgba(17,17,17,0.6)",
            }}
          >
            <div
              className="absolute font-medium"
              style={{
                top: 0,
                right: 12,
                transform: "translateY(-50%)",
                background: "var(--accent)",
                color: "white",
                fontSize: "11px",
                padding: "4px 12px",
                borderRadius: "999px",
              }}
            >
              Popular
            </div>
            <h3
              className="text-white font-medium"
              style={{ fontSize: "24px" }}
            >
              Pro
            </h3>
            <div className="flex items-baseline gap-1 mt-2">
              <span
                className="text-white font-light"
                style={{ fontSize: "48px", lineHeight: 1 }}
              >
                $12
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                /month
              </span>
            </div>
            <ul className="flex flex-col gap-3 mt-8">
              {proFeatures.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check
                    size={16}
                    style={{ color: "var(--accent)", flexShrink: 0 }}
                  />
                  <span
                    style={{
                      fontSize: "14px",
                      color: "rgba(255,255,255,0.55)",
                    }}
                  >
                    {f}
                  </span>
                </li>
              ))}
            </ul>
            <button className="btn-primary w-full mt-8">Start free trial</button>
          </div>
        </div>
      </div>
    </section>
  );
}
