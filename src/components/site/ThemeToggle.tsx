import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";
const KEY = "aimsa-theme";

function apply(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
  document.documentElement.style.colorScheme = theme;
}

export function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>("dark");

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Theme | null;
    const preferred: Theme =
      stored ?? (window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark");
    setTheme(preferred);
    apply(preferred);
  }, []);

  function toggle() {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    apply(next);
    localStorage.setItem(KEY, next);
  }

  return (
    <Button
      variant="quiet"
      size="icon"
      onClick={toggle}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
    >
      {theme === "dark" ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
    </Button>
  );
}
