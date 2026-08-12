import type { GalleryAlbum } from "./types";

/**
 * Add albums as event photography is collected and cleared for publication.
 * Respect participant privacy: no personal data in filenames or captions.
 * Place optimized images in `public/gallery/` and reference them as
 * `/gallery/<file>.webp` with descriptive alt text.
 */
export const albums: GalleryAlbum[] = [];
