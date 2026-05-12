import { useState, useEffect, useRef } from "react";

const questions = [
  {
    q: "Is my data really private?",
    a: "Absolutely. We use client-side encryption, which means your data is encrypted on your device before it ever reaches our servers. We physically cannot access your content.",
  },
  {
    q: "Can I export my data?",
    a: "Yes, anytime. Export everything as a ZIP archive with a single click. No lock-in, no friction.",
  },
  {
    q: "What happens if I cancel Pro?",
    a: "You keep everything you've uploaded. Your vaults drop to Free tier limits — you can still view and download, but can't add new items beyond the limit.",
  },
  {
    q: "Do you offer team plans?",
    a: "Team features are built into Pro. Create shared vaults, assign roles, and collaborate in real-time. Enterprise plans with SSO and audit logs are coming soon.",
  },
  {
    q: "Is there a mobile app?",
    a: "Kapten works beautifully in any mobile browser. Native iOS and Android apps are on the roadmap for late 2026.",
  },
  {
    q: "How does versioning work?",
    a: "Every change is saved as a version. Browse the timeline, compare versions side-by-side, and restore any point in time with one click.",
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      style={{
        borderBottom: "1px solid var(--border-subtle)",
      }}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between py-6 text-left"
      >
        <span
          className="text-white font-normal"
          style={{ fontSize: "16px" }}
        >
          {q}
        </span>
        <span
          style={{
            fontSize: "20px",
            color: "rgba(255,255,255,0.55)",
            transform: isOpen ? "rotate(45deg)" : "rotate(0deg)",
            transition: "transform 0.3s ease",
            flexShrink: 0,
            marginLeft: 16,
          }}
        >
          +
        </span>
      </button>
      <div
        style={{
          display: "grid",
          gridTemplateRows: isOpen ? "1fr" : "0fr",
          transition: "grid-template-rows 0.3s ease",
        }}
      >
        <div style={{ overflow: "hidden", minHeight: 0 }}>
          <p
            className="pb-6"
            style={{
              fontSize: "15px",
              lineHeight: 1.6,
              color: "rgba(255,255,255,0.55)",
            }}
          >
            {a}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="faq"
      style={{
        background: "var(--bg-void)",
        padding: "120px 24px",
        position: "relative",
        zIndex: 2,
      }}
    >
      <div ref={ref} className="max-w-[720px] mx-auto">
        <h2
          data-animate
          className="text-white font-normal text-center"
          style={{
            fontSize: "clamp(28px, 3vw, 36px)",
            lineHeight: 1.2,
            letterSpacing: "-0.01em",
          }}
        >
          Questions?
        </h2>
        <div data-animate className="mt-16">
          {questions.map((item, i) => (
            <AccordionItem
              key={i}
              q={item.q}
              a={item.a}
              isOpen={openIndex === i}
              onToggle={() => setOpenIndex(openIndex === i ? null : i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
