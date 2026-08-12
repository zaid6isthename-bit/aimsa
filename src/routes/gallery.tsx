import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, ImageIcon, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/site/PageHeader";
import { EmptyState } from "@/components/site/EmptyState";
import { cmsAlbums, copy } from "@/lib/cms/store";
import type { GalleryImage } from "@/content/types";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery — AIMSA event moments | LTCE Navi Mumbai" },
      {
        name: "description",
        content: "Photo albums from AIMSA workshops, debates and build weeks at LTCE Navi Mumbai.",
      },
      { property: "og:title", content: "AIMSA gallery" },
      { property: "og:description", content: "Moments from AIMSA events at LTCE Navi Mumbai." },
    ],
  }),
  component: GalleryPage,
});

function GalleryPage() {
  const albums = cmsAlbums();
  const [filter, setFilter] = useState<string>("");
  const [lightbox, setLightbox] = useState<{ images: GalleryImage[]; index: number } | null>(null);
  const categories = [...new Set(albums.map((a) => a.category))];
  const shown = filter ? albums.filter((a) => a.category === filter) : albums;

  return (
    <>
      <PageHeader
        eyebrow={copy("gallery.eyebrow")}
        title={copy("gallery.title")}
        intro={copy("gallery.intro")}
        breadcrumb={[{ label: "Home", to: "/" }, { label: "Gallery" }]}
      />

      <div className="relative isolate overflow-hidden">
      <ArtBackdrop image={bgFor("gallery:albums")} position="center 45%" />
      <div className="container-aimsa section-y">
        {albums.length === 0 ? (
          <EmptyState
            icon={<ImageIcon className="size-8" aria-hidden="true" />}
            title="The first albums are being prepared"
            description={copy("gallery.emptyText")}
            action={
              <div className="flex flex-wrap justify-center gap-3">
                <Button asChild variant="hero">
                  <Link to="/events">View events</Link>
                </Button>
                <Button asChild variant="quiet">
                  <Link to="/contact">Share your event photos</Link>
                </Button>
              </div>
            }
          />
        ) : (
          <>
            {categories.length > 1 ? (
              <div className="mb-8 flex flex-wrap gap-2">
                <Button variant={filter ? "quiet" : "default"} size="sm" onClick={() => setFilter("")}>
                  All albums
                </Button>
                {categories.map((c) => (
                  <Button
                    key={c}
                    variant={filter === c ? "default" : "quiet"}
                    size="sm"
                    onClick={() => setFilter(c)}
                  >
                    {c}
                  </Button>
                ))}
              </div>
            ) : null}

            <div className="space-y-14">
              {shown.map((album) => (
                <section key={album.id} aria-labelledby={`album-${album.id}`}>
                  <h2 id={`album-${album.id}`} className="text-2xl font-bold">
                    {album.title}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {album.category} · {album.year}
                  </p>
                  <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {album.images.map((image, index) => (
                      <li key={image.src}>
                        <button
                          className="group block w-full overflow-hidden rounded-xl border border-border"
                          onClick={() => setLightbox({ images: album.images, index })}
                        >
                          <img
                            src={image.src}
                            alt={image.alt}
                            loading="lazy"
                            className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                        </button>
                        {image.caption ? (
                          <p className="mt-2 text-xs text-muted-foreground">{image.caption}</p>
                        ) : null}
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
          </>
        )}
      </div>
      </div>

      {lightbox ? (
        <Lightbox
          images={lightbox.images}
          index={lightbox.index}
          onIndexChange={(index) => setLightbox({ images: lightbox.images, index })}
          onClose={() => setLightbox(null)}
        />
      ) : null}
    </>
  );
}

function Lightbox({
  images,
  index,
  onIndexChange,
  onClose,
}: {
  images: GalleryImage[];
  index: number;
  onIndexChange: (index: number) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const image = images[index];

  useEffect(() => {
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") onIndexChange((index + 1) % images.length);
      if (e.key === "ArrowLeft") onIndexChange((index - 1 + images.length) % images.length);
      if (e.key === "Tab") e.preventDefault();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [index, images.length, onClose, onIndexChange]);

  if (!image) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={image.alt}
      tabIndex={-1}
      ref={ref}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-background/95 p-4"
    >
      <Button variant="quiet" size="icon" className="absolute right-4 top-4" onClick={onClose} aria-label="Close">
        <X aria-hidden="true" />
      </Button>
      <Button
        variant="quiet"
        size="icon"
        className="absolute left-4"
        aria-label="Previous image"
        onClick={() => onIndexChange((index - 1 + images.length) % images.length)}
      >
        <ChevronLeft aria-hidden="true" />
      </Button>
      <figure className="max-h-full max-w-4xl text-center">
        <img src={image.src} alt={image.alt} className="mx-auto max-h-[75vh] rounded-xl object-contain" />
        {image.caption ? (
          <figcaption className="mt-3 text-sm text-muted-foreground">{image.caption}</figcaption>
        ) : null}
      </figure>
      <Button
        variant="quiet"
        size="icon"
        className="absolute right-4 top-1/2"
        aria-label="Next image"
        onClick={() => onIndexChange((index + 1) % images.length)}
      >
        <ChevronRight aria-hidden="true" />
      </Button>
    </div>
  );
}
