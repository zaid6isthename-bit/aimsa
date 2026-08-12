/** Retro-futurist horizon: sun disc, scrolling perspective grid, star haze. */
export function GridHorizon({ className = "" }: { className?: string }) {
  return (
    <div className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`} aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(120%_80%_at_50%_-10%,var(--color-violet)/25,transparent_60%)] opacity-40" />
      <div className="absolute left-1/2 top-[38%] size-[26rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-primary via-violet to-transparent opacity-25 blur-2xl" />
      <div className="absolute bottom-0 left-0 right-0 h-[46%]">
        <div className="horizon-grid animate-horizon absolute inset-0" />
      </div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent" />
    </div>
  );
}