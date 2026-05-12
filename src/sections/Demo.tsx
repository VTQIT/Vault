import { useEffect, useRef } from "react";

export default function Demo() {
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
      style={{
        background: "var(--bg-void)",
        padding: "120px 24px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div ref={ref} className="max-w-[960px] mx-auto flex flex-col items-center">
        <h2
          data-animate
          className="text-white font-normal text-center"
          style={{
            fontSize: "clamp(28px, 3vw, 36px)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          See everything at a glance
        </h2>
        <p
          data-animate
          className="mt-4 text-center max-w-md"
          style={{
            fontSize: "16px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          A clean, organized view of your entire digital life.
        </p>
        <div
          data-animate
          className="mt-16 w-full"
          style={{
            borderRadius: "var(--radius-card)",
            border: "1px solid var(--border-subtle)",
            boxShadow: "0 20px 80px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          <div
            className="flex flex-col"
            style={{
              background: "var(--bg-elevated)",
              minHeight: 400,
            }}
          >
            <div
              className="flex items-center gap-2 px-4"
              style={{
                height: 40,
                borderBottom: "1px solid var(--border-subtle)",
                background: "var(--bg-surface)",
              }}
            >
              <div
                className="rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              <div
                className="rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
              <div
                className="rounded-full"
                style={{
                  width: 10,
                  height: 10,
                  background: "rgba(255,255,255,0.15)",
                }}
              />
            </div>
            <div className="flex flex-1">
              <div
                className="hidden md:flex flex-col gap-2 p-4"
                style={{
                  width: 180,
                  borderRight: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                }}
              >
                {["All Items", "Files", "Notes", "URLs", "Snippets", "Media"].map(
                  (item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 px-3 py-2 rounded-md"
                      style={{
                        background: i === 0 ? "rgba(255,255,255,0.04)" : "transparent",
                      }}
                    >
                      <div
                        className="rounded-sm"
                        style={{
                          width: 14,
                          height: 14,
                          background:
                            i === 0
                              ? "var(--accent)"
                              : "rgba(255,255,255,0.1)",
                        }}
                      />
                      <span
                        style={{
                          fontSize: "13px",
                          color:
                            i === 0
                              ? "white"
                              : "rgba(255,255,255,0.4)",
                        }}
                      >
                        {item}
                      </span>
                    </div>
                  )
                )}
              </div>
              <div className="flex-1 p-4">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col gap-2 p-3 rounded-lg"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid var(--border-subtle)",
                      }}
                    >
                      <div
                        className="rounded"
                        style={{
                          height: 60,
                          background: `rgba(255,255,255,0.04)`,
                        }}
                      />
                      <div
                        className="rounded"
                        style={{
                          height: 10,
                          width: "70%",
                          background: "rgba(255,255,255,0.1)",
                        }}
                      />
                      <div
                        className="rounded"
                        style={{
                          height: 8,
                          width: "40%",
                          background: "rgba(255,255,255,0.06)",
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div
                className="hidden lg:flex flex-col gap-3 p-4"
                style={{
                  width: 240,
                  borderLeft: "1px solid var(--border-subtle)",
                  background: "var(--bg-surface)",
                }}
              >
                <div
                  className="rounded"
                  style={{
                    height: 120,
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid var(--border-subtle)",
                  }}
                />
                <div
                  className="rounded"
                  style={{
                    height: 12,
                    width: "60%",
                    background: "rgba(255,255,255,0.1)",
                  }}
                />
                <div
                  className="rounded"
                  style={{
                    height: 8,
                    width: "80%",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
                <div
                  className="rounded"
                  style={{
                    height: 8,
                    width: "50%",
                    background: "rgba(255,255,255,0.06)",
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
