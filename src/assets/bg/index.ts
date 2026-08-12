import bg1 from "./bg-1.jpg.asset.json";
import bg2 from "./bg-2.jpg.asset.json";
import bg3 from "./bg-3.jpg.asset.json";
import bg4 from "./bg-4.png.asset.json";
import bg5 from "./bg-5.jpg.asset.json";
import bg6 from "./bg-6.jpg.asset.json";
import bg7 from "./bg-7.png.asset.json";
import bg8 from "./bg-8.webp.asset.json";
import bg9 from "./bg-9.png.asset.json";
import bg10 from "./bg-10.jpg.asset.json";
import bg11 from "./bg-11.jpg.asset.json";
import bg12 from "./bg-12.jpg.asset.json";
import bg13 from "./bg-13.jpg.asset.json";
import bg14 from "./bg-14.jpg.asset.json";
import bg15 from "./bg-15.avif.asset.json";
import bg16 from "./bg-16.avif.asset.json";
import bg17 from "./bg-17.jpg.asset.json";
import bg18 from "./bg-18.jpg.asset.json";
import bg19 from "./bg-19.jpg.asset.json";
import bg20 from "./bg-20.avif.asset.json";
import bg21 from "./bg-21.jpg.asset.json";
import bg22 from "./bg-22.jpg.asset.json";
import bg23 from "./bg-23.jpg.asset.json";

/** Every uploaded synthwave backdrop, in upload order. */
export const backgrounds: string[] = [
  bg1.url,
  bg2.url,
  bg3.url,
  bg4.url,
  bg5.url,
  bg6.url,
  bg7.url,
  bg8.url,
  bg9.url,
  bg10.url,
  bg11.url,
  bg12.url,
  bg13.url,
  bg14.url,
  bg15.url,
  bg16.url,
  bg17.url,
  bg18.url,
  bg19.url,
  bg20.url,
  bg21.url,
  bg22.url,
  bg23.url,
];

/** Standard artwork opacity across the site. */
export const ART_OPACITY = 0.8;

/** Deterministic backdrop for a named slot, so SSR and client agree. */
export function bgFor(key: string): string {
  let hash = 0;
  for (let i = 0; i < key.length; i += 1) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  return backgrounds[hash % backgrounds.length]!;
}