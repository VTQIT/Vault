import { useEffect, useState } from "react";
import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10"
      style={{
        height: 64,
        backdropFilter: scrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(12px)" : "none",
        background: scrolled ? "rgba(5,5,5,0.7)" : "transparent",
        transition: "all 0.3s ease",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.08)" : "1px solid transparent",
      }}
    >
      <Link
        to="/"
        className="text-white font-medium tracking-[0.15em] text-lg"
      >
        KAPTEN
      </Link>
      <div className="flex items-center gap-6">
        <a
          href="#features"
          className="hidden md:block text-sm transition-colors duration-300 hover:text-white"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Features
        </a>
        <a
          href="#pricing"
          className="hidden md:block text-sm transition-colors duration-300 hover:text-white"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          Pricing
        </a>
        <a
          href="#faq"
          className="hidden md:block text-sm transition-colors duration-300 hover:text-white"
          style={{ color: "rgba(255,255,255,0.55)" }}
        >
          FAQ
        </a>
        {isAuthenticated ? (
          <div className="flex items-center gap-3">
            <Link
              to="/dashboard"
              className="text-sm font-medium transition-colors duration-300 hover:text-white"
              style={{ color: "rgba(255,255,255,0.55)" }}
            >
              {user?.name || "Dashboard"}
            </Link>
            <button
              onClick={logout}
              className="btn-outline text-xs py-2 px-4"
            >
              Log out
            </button>
          </div>
        ) : (
          <Link
            to="/login"
            className="btn-outline text-xs py-2 px-5"
          >
            Get Started
          </Link>
        )}
      </div>
    </nav>
  );
}
