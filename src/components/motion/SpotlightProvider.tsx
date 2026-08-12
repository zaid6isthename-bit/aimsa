import { useEffect, useRef } from 'react';

/**
 * Global spotlight provider.
 *
 * Applies the same mouse-following radial-gradient effect as
 * <SpotlightCard /> to every element that uses the `.surface-card`
 * utility class, without having to wrap each card individually.
 */
export function SpotlightProvider({ children }: { children: React.ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const handleMove = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('.surface-card') as HTMLElement | null;
      if (!target) return;
      const rect = target.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      target.style.setProperty('--mouse-x', `${x}px`);
      target.style.setProperty('--mouse-y', `${y}px`);
    };

    root.addEventListener('mousemove', handleMove, { passive: true });
    return () => root.removeEventListener('mousemove', handleMove);
  }, []);

  return <div ref={rootRef} data-spotlight-provider>{children}</div>;
}
