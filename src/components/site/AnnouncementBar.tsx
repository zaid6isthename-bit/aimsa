import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { X } from "lucide-react";
import { activeAnnouncements } from "@/lib/content";
import { copy } from "@/lib/cms/store";

const KEY = "aimsa-announcement-dismissed";

export function AnnouncementBar() {
  const bannerText = copy("global.bannerText").trim();
  const bannerHref = copy("global.bannerHref").trim();
  const pinned = bannerText
    ? {
        id: `banner:${bannerText}`,
        category: "Notice",
        title: bannerText,
        ctaHref: bannerHref || undefined,
        ctaLabel: "Read more",
        pinned: true,
      }
    : activeAnnouncements().find((a) => a.pinned);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    if (!pinned) return;
    setDismissed(localStorage.getItem(KEY) === pinned.id);
  }, [pinned]);

  if (!pinned || dismissed) return null;

  return (
    <div className="relative border-b border-border bg-surface-2/70">
      <div className="container-aimsa flex items-center justify-center gap-3 py-2 pr-10 text-center text-sm">
        <span className="hidden rounded-full bg-primary/15 px-2 py-0.5 text-xs font-semibold text-primary sm:inline">
          {pinned.category}
        </span>
        <p className="text-muted-foreground">
          {pinned.title}{" "}
          {pinned.ctaHref?.startsWith("/") ? (
            <Link to={pinned.ctaHref} className="font-semibold text-foreground underline underline-offset-4">
              {pinned.ctaLabel ?? "Read more"}
            </Link>
          ) : null}
        </p>
        <button
          onClick={() => {
            localStorage.setItem(KEY, pinned.id);
            setDismissed(true);
          }}
          className="absolute right-4 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:text-foreground"
          aria-label="Dismiss announcement"
        >
          <X className="size-4" aria-hidden="true" />
        </button>
      </div>
    </div>
  );
}
