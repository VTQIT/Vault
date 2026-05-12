import { Link } from "react-router";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ background: "var(--bg-void)" }}
    >
      <div className="flex flex-col items-center text-center">
        <span
          className="font-light text-white"
          style={{ fontSize: "96px", lineHeight: 1, letterSpacing: "-0.03em" }}
        >
          404
        </span>
        <p
          className="mt-4"
          style={{ fontSize: "16px", color: "rgba(255,255,255,0.55)" }}
        >
          This page doesn't exist in your vault.
        </p>
        <Link
          to="/"
          className="btn-primary flex items-center gap-2 mt-8"
          style={{ fontSize: "14px", padding: "12px 24px" }}
        >
          <ArrowLeft size={16} />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
