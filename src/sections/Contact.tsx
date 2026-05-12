import { useEffect, useRef, useCallback } from "react";
import { Link } from "react-router";
import { ShieldCheck } from "lucide-react";

export default function Contact() {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const card = cardRef.current;
    if (!card) return;
    const inner = card.querySelector(".tilt-inner") as HTMLElement;
    if (!inner) return;

    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty("--mouse-x", x + "px");
    card.style.setProperty("--mouse-y", y + "px");

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -12;
    const rotateY = ((x - centerX) / centerX) * 12;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
    inner.style.transform = `rotateX(${-rotateX * 0.5}deg) rotateY(${-rotateY * 0.5}deg) scale3d(1, 1, 1)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const inner = card.querySelector(".tilt-inner") as HTMLElement;
    if (!inner) return;

    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    inner.style.transform =
      "rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
  }, []);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [handleMouseMove, handleMouseLeave]);

  return (
    <section
      style={{
        background: "var(--bg-surface)",
        padding: "120px 24px 80px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div className="flex flex-col items-center">
        <h2
          className="text-white font-normal text-center"
          style={{
            fontSize: "clamp(32px, 4vw, 56px)",
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
        >
          Let's talk
        </h2>
        <p
          className="mt-4 text-center max-w-md"
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Have a question or need help? We're here.
        </p>

        <div
          ref={cardRef}
          className="relative overflow-hidden cursor-pointer mt-16"
          style={{
            width: "100%",
            maxWidth: 480,
            height: 280,
            borderRadius: 16,
            background: "#0e0e0e",
            border: "1px solid var(--border-subtle)",
            transform: "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)",
            transition: "transform 0.5s ease",
          }}
        >
          <div
            style={{
              content: "''",
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(800px circle at var(--mouse-x, 50%) var(--mouse-y, 50%), rgba(255,255,255,0.06), transparent 40%)",
              pointerEvents: "none",
              zIndex: 1,
            }}
          />
          <div
            className="tilt-inner w-full h-full flex flex-col items-center justify-center p-8 relative"
            style={{
              zIndex: 2,
              transition: "transform 0.5s ease",
            }}
          >
            <ShieldCheck
              size={48}
              style={{ color: "rgba(255,255,255,0.8)" }}
              strokeWidth={1.2}
            />
            <h3
              className="mt-4 text-white font-medium"
              style={{ fontSize: "20px" }}
            >
              Drop us a line
            </h3>
            <span
              className="font-mono mt-2"
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.55)",
                letterSpacing: "0.04em",
              }}
            >
              hello@kapten.io
            </span>
            <div className="flex items-center gap-2 mt-6">
              <a href="mailto:hello@kapten.io" className="btn-primary text-sm py-2.5 px-6">
                Email us
              </a>
              <Link
                to="/dashboard"
                className="btn-outline text-sm py-2.5 px-6"
              >
                View docs
              </Link>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center mt-20">
          <span
            className="font-medium"
            style={{
              fontSize: "16px",
              letterSpacing: "0.12em",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            KAPTEN
          </span>
          <span
            className="mt-2"
            style={{
              fontSize: "13px",
              color: "rgba(255,255,255,0.25)",
            }}
          >
            2026 Kapten. All rights reserved.
          </span>
        </div>
      </div>
    </section>
  );
}
