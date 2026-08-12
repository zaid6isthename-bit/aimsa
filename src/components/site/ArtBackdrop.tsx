import type { CSSProperties } from "react";
import { ART_OPACITY } from "@/assets/bg";

interface ArtBackdropProps {
  /** Artwork URL rendered behind the section content. */
  image: string;
  /** 0–1 image opacity. */
  opacity?: number;
  /** Focal point of the artwork. */
  position?: string;
  className?: string;
}

/**
 * Decorative full-bleed artwork layer for a section.
 * Parent must be `relative isolate overflow-hidden`.
 */
export function ArtBackdrop({
  image,
  opacity = ART_OPACITY,
  position = "center",
  className = "",
}: ArtBackdropProps) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 -z-10 ${className}`}>
      <img
        src={image}
        alt=""
        loading="lazy"
        className="h-full w-full object-cover"
        style={{ opacity, objectPosition: position } as CSSProperties}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-background via-background/65 to-background" />
    </div>
  );
}
