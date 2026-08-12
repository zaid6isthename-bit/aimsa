import { Suspense, lazy, useEffect, useState } from "react";

const Hyperspeed = lazy(() => import("./Hyperspeed"));

const OPTIONS = {
  distortion: "turbulentDistortion",
  length: 400,
  roadWidth: 10,
  islandWidth: 2,
  lanesPerRoad: 3,
  fov: 90,
  fovSpeedUp: 150,
  speedUp: 2,
  carLightsFade: 0.4,
  totalSideLightSticks: 20,
  lightPairsPerRoadWay: 40,
  colors: {
    roadColor: 0x080808,
    islandColor: 0x0a0a0a,
    background: 0x000000,
    shoulderLines: 0x131318,
    brokenLines: 0x131318,
    leftCars: [0xd856bf, 0x6750a2, 0xc247ac],
    rightCars: [0x03b3c3, 0x0e5ea5, 0x324555],
    sticks: 0x03b3c3,
  },
};

/**
 * Fixed, full-viewport Hyperspeed backdrop used behind the home page
 * content that follows the hero section.
 */
export function HyperspeedBackground() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const id = window.setTimeout(() => setMounted(true), 200);
    return () => window.clearTimeout(id);
  }, []);

  if (!mounted) return null;

  return (
    <Suspense fallback={null}>
      <Hyperspeed effectOptions={OPTIONS} />
    </Suspense>
  );
}

export default HyperspeedBackground;
