import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { gsap } from "gsap";
import "./BubbleMenu.css";

export type BubbleMenuItem = {
  label: string;
  href: string;
  ariaLabel?: string;
  rotation?: number;
  hoverStyles?: { bgColor?: string; textColor?: string };
};

type BubbleMenuProps = {
  logo?: ReactNode;
  onMenuClick?: (open: boolean) => void;
  className?: string;
  style?: CSSProperties;
  menuAriaLabel?: string;
  menuBg?: string;
  menuContentColor?: string;
  useFixedPosition?: boolean;
  items: BubbleMenuItem[];
  animationEase?: string;
  animationDuration?: number;
  staggerDelay?: number;
  trailing?: ReactNode;
};

export default function BubbleMenu({
  logo,
  onMenuClick,
  className,
  style,
  menuAriaLabel = "Toggle menu",
  menuBg = "#fff",
  menuContentColor = "#111",
  useFixedPosition = false,
  items,
  animationEase = "back.out(1.5)",
  animationDuration = 0.5,
  staggerDelay = 0.12,
  trailing,
}: BubbleMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);

  const overlayRef = useRef<HTMLDivElement | null>(null);
  const bubblesRef = useRef<Array<HTMLElement | null>>([]);
  const labelRefs = useRef<Array<HTMLElement | null>>([]);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const menuItems = items;
  const containerClassName = ["bubble-menu", useFixedPosition ? "fixed" : "absolute", className]
    .filter(Boolean)
    .join(" ");

  const handleToggle = () => {
    const nextState = !isMenuOpen;
    if (nextState) setShowOverlay(true);
    setIsMenuOpen(nextState);
    onMenuClick?.(nextState);
  };

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  useEffect(() => {
    const overlay = overlayRef.current;
    const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[];
    const labels = labelRefs.current.filter(Boolean) as HTMLElement[];
    if (!overlay || !bubbles.length) return;

    if (isMenuOpen) {
      gsap.set(overlay, { display: "flex" });
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.set(bubbles, { scale: 0, transformOrigin: "50% 50%" });
      gsap.set(labels, { y: 24, autoAlpha: 0 });

      bubbles.forEach((bubble, i) => {
        const delay = i * staggerDelay + gsap.utils.random(-0.05, 0.05);
        const tl = gsap.timeline({ delay });
        tl.to(bubble, { scale: 1, duration: animationDuration, ease: animationEase });
        if (labels[i]) {
          tl.to(
            labels[i],
            { y: 0, autoAlpha: 1, duration: animationDuration, ease: "power3.out" },
            `-=${animationDuration * 0.9}`,
          );
        }
      });
    } else if (showOverlay) {
      gsap.killTweensOf([...bubbles, ...labels]);
      gsap.to(labels, { y: 24, autoAlpha: 0, duration: 0.2, ease: "power3.in" });
      gsap.to(bubbles, {
        scale: 0,
        duration: 0.2,
        ease: "power3.in",
        onComplete: () => {
          gsap.set(overlay, { display: "none" });
          setShowOverlay(false);
        },
      });
    }
  }, [isMenuOpen, showOverlay, animationEase, animationDuration, staggerDelay]);

  useEffect(() => {
    const handleResize = () => {
      if (!isMenuOpen) return;
      const bubbles = bubblesRef.current.filter(Boolean) as HTMLElement[];
      const isDesktop = window.innerWidth >= 900;
      bubbles.forEach((bubble, i) => {
        const item = menuItems[i];
        if (bubble && item) gsap.set(bubble, { rotation: isDesktop ? (item.rotation ?? 0) : 0 });
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [isMenuOpen, menuItems]);

  return (
    <>
      <nav className={containerClassName} style={style} aria-label="Primary">
        <Link
          to="/"
          className="bubble logo-bubble"
          aria-label="Home"
          style={{ background: menuBg, color: menuContentColor }}
        >
          <span className="logo-content">
            {typeof logo === "string" ? <img src={logo} alt="Logo" className="bubble-logo" /> : logo}
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 12, pointerEvents: "auto" }}>
          {trailing}
          <button
            type="button"
            className={`bubble toggle-bubble menu-btn ${isMenuOpen ? "open" : ""}`}
            onClick={handleToggle}
            aria-label={menuAriaLabel}
            aria-pressed={isMenuOpen}
            style={{ background: menuBg }}
          >
            <span className="menu-line" style={{ background: menuContentColor }} />
            <span className="menu-line" style={{ background: menuContentColor }} />
          </button>
        </div>
      </nav>

      {showOverlay && (
        <div
          ref={overlayRef}
          className={`bubble-menu-items ${useFixedPosition ? "fixed" : "absolute"}`}
          aria-hidden={!isMenuOpen}
          style={{ background: "oklch(0.12 0.03 265 / 0.72)", backdropFilter: "blur(10px)" }}
        >
          <ul className="pill-list" role="menu" aria-label="Menu links">
            {menuItems.map((item, idx) => (
              <li role="none" className="pill-col" key={`${item.href}-${item.label}`}>
                <Link
                  role="menuitem"
                  to={item.href}
                  aria-label={item.ariaLabel || item.label}
                  className="pill-link"
                  onClick={() => setIsMenuOpen(false)}
                  style={
                    {
                      "--item-rot": `${item.rotation ?? 0}deg`,
                      "--pill-bg": menuBg,
                      "--pill-color": menuContentColor,
                      "--hover-bg": item.hoverStyles?.bgColor || "#f3f4f6",
                      "--hover-color": item.hoverStyles?.textColor || menuContentColor,
                    } as CSSProperties
                  }
                  ref={(el) => {
                    if (el) bubblesRef.current[idx] = el;
                  }}
                >
                  <span
                    className="pill-label"
                    ref={(el) => {
                      if (el) labelRefs.current[idx] = el;
                    }}
                  >
                    {item.label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
