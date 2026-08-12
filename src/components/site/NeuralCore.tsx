/**
 * AIMSA Neural Core — original hero motif built from inline SVG.
 * Decorative: hidden from assistive tech, static under prefers-reduced-motion.
 */
export function NeuralCore({ className = "" }: { className?: string }) {
  const nodes = [
    { x: 200, y: 60, r: 4 },
    { x: 92, y: 128, r: 3 },
    { x: 308, y: 126, r: 3 },
    { x: 60, y: 246, r: 3.5 },
    { x: 340, y: 250, r: 3.5 },
    { x: 148, y: 196, r: 2.5 },
    { x: 254, y: 200, r: 2.5 },
    { x: 200, y: 330, r: 4 },
    { x: 126, y: 306, r: 2.5 },
    { x: 276, y: 302, r: 2.5 },
  ];
  const edges: [number, number][] = [
    [0, 1], [0, 2], [1, 3], [2, 4], [1, 5], [2, 6], [5, 6], [5, 8], [6, 9], [3, 8], [4, 9], [8, 7], [9, 7],
  ];

  return (
    <div className={`relative ${className}`} aria-hidden="true">
      <svg viewBox="0 0 400 400" className="h-full w-full" role="presentation">
        <defs>
          <radialGradient id="core-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.35" />
            <stop offset="70%" stopColor="var(--color-accent)" stopOpacity="0.06" />
            <stop offset="100%" stopColor="transparent" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="core-edge" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-primary)" />
            <stop offset="100%" stopColor="var(--color-accent)" />
          </linearGradient>
        </defs>

        <circle cx="200" cy="200" r="185" fill="url(#core-glow)" />

        {[150, 172].map((r, i) => (
          <circle
            key={r}
            cx="200"
            cy="200"
            r={r}
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth="1"
            strokeDasharray={i === 0 ? "3 10" : "1 14"}
            style={{
              transformOrigin: "200px 200px",
              animation: `aimsa-orbit ${i === 0 ? 70 : 110}s linear infinite ${i === 0 ? "" : "reverse"}`,
            }}
          />
        ))}

        <g style={{ transformOrigin: "200px 200px", animation: "aimsa-orbit 40s linear infinite" }}>
          <circle cx="200" cy="28" r="3" fill="var(--color-accent)" />
          <circle cx="372" cy="200" r="2" fill="var(--color-primary)" />
        </g>

        <polygon
          points="200,112 276,156 276,244 200,288 124,244 124,156"
          fill="none"
          stroke="url(#core-edge)"
          strokeWidth="1.5"
          opacity="0.75"
        />
        <polygon
          points="200,140 252,170 252,230 200,260 148,230 148,170"
          fill="var(--color-primary)"
          opacity="0.06"
          stroke="var(--color-border-strong)"
        />

        {edges.map(([a, b], i) => (
          <line
            key={i}
            x1={nodes[a]!.x}
            y1={nodes[a]!.y}
            x2={nodes[b]!.x}
            y2={nodes[b]!.y}
            stroke="url(#core-edge)"
            strokeWidth="1"
            opacity="0.5"
            strokeDasharray="240"
            style={{ animation: `aimsa-trace ${2 + (i % 5) * 0.4}s ease-out both` }}
          />
        ))}

        {nodes.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.r}
            fill={i % 3 === 0 ? "var(--color-accent)" : "var(--color-primary)"}
            style={{ animation: `aimsa-pulse-node ${3 + (i % 4)}s ease-in-out ${i * 0.2}s infinite` }}
          />
        ))}

        <g fill="var(--color-muted-foreground)" fontSize="9" fontFamily="var(--font-body)" opacity="0.8">
          <text x="200" y="205" textAnchor="middle" fill="var(--color-foreground)" fontSize="13" letterSpacing="4">
            AIMSA
          </text>
          <text x="200" y="222" textAnchor="middle" letterSpacing="1.5">
            LEARN · BUILD · LEAD
          </text>
          <text x="24" y="384">signal → system</text>
          <text x="376" y="384" textAnchor="end">LTCE · NAVI MUMBAI</text>
        </g>
      </svg>
    </div>
  );
}
