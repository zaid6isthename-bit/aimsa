import { useEffect, useState } from "react";
import { useRouterState } from "@tanstack/react-router";

/** Neon wipe played on every route change. */
export function RouteTransition() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [key, setKey] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (!mounted) {
      setMounted(true);
      return;
    }
    setKey((k) => k + 1);
  }, [pathname]);

  if (!mounted || key === 0) return null;

  return (
    <div key={key} className="pointer-events-none fixed inset-0 z-[150] overflow-hidden" aria-hidden="true">
      <div
        className="h-full w-full bg-gradient-to-r from-primary via-violet to-accent opacity-70"
        style={{ animation: "aimsa-sweep 700ms cubic-bezier(0.76, 0, 0.24, 1) forwards" }}
      />
    </div>
  );
}