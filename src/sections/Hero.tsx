import { useEffect, useRef } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Hero() {
  const contentRef = useRef<HTMLDivElement>(null);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    el.style.opacity = "0";
    el.style.transform = "translateY(20px)";
    const t = setTimeout(() => {
      el.style.transition = "opacity 1s ease, transform 1s ease";
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, 300);
    return () => clearTimeout(t);
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center"
      style={{ minHeight: "100vh", zIndex: 1 }}
    >
      <div
        ref={contentRef}
        className="flex flex-col items-center text-center px-4"
        style={{ marginTop: "20vh" }}
      >
        <h1
          className="text-white font-light"
          style={{
            fontSize: "clamp(40px, 6vw, 72px)",
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            textShadow: "0 2px 40px rgba(0,0,0,0.6)",
          }}
        >
          Your digital vault
        </h1>
        <p
          className="mt-5 max-w-md"
          style={{
            fontSize: "18px",
            lineHeight: 1.6,
            color: "rgba(255,255,255,0.55)",
          }}
        >
          Store, organize, and share everything that matters.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3">
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="btn-primary"
          >
            {isAuthenticated ? "Open your vault" : "Open your vault"}
          </Link>
          <span
            className="font-mono"
            style={{
              fontSize: "12px",
              color: "rgba(255,255,255,0.25)",
              letterSpacing: "0.04em",
            }}
          >
            Free for personal use. No credit card.
          </span>
        </div>
      </div>
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{
          height: "1px",
          background: "rgba(255,255,255,0.08)",
        }}
      />
    </section>
  );
}
