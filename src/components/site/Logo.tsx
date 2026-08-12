import { Link } from "@tanstack/react-router";
import logo from "@/assets/aimsa-wordmark.png.asset.json";
import { site } from "@/content/site";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link
      to="/"
      data-easter-egg
      className="group flex items-center gap-3"
      aria-label={`${site.name} — home`}
    >
      <img
        src={logo.url}
        alt=""
        width={132}
        height={40}
        className="h-9 w-auto transition-transform duration-200 group-hover:scale-105"
      />
      <span className="leading-tight">
        {!compact ? (
          <span className="block text-[0.68rem] uppercase tracking-[0.16em] text-muted-foreground">
            AI &amp; ML Students Association
          </span>
        ) : null}
      </span>
    </Link>
  );
}
