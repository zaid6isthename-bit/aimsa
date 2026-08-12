import BubbleMenu, { type BubbleMenuItem } from "@/components/motion/BubbleMenu";
import logo from "@/assets/aimsa-wordmark.png.asset.json";
import { site } from "@/content/site";
import { ThemeToggle } from "./ThemeToggle";
import { AnnouncementBar } from "./AnnouncementBar";

const items: BubbleMenuItem[] = [
  { label: "Home", href: "/", ariaLabel: "Home", rotation: -8, hoverStyles: { bgColor: "#00e5ff", textColor: "#05080f" } },
  { label: "About", href: "/about", ariaLabel: "About", rotation: 8, hoverStyles: { bgColor: "#ff2fd0", textColor: "#ffffff" } },
  { label: "Events", href: "/events", ariaLabel: "Events", rotation: -6, hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" } },
  { label: "Projects", href: "/projects", ariaLabel: "Projects", rotation: 6, hoverStyles: { bgColor: "#00e5ff", textColor: "#05080f" } },
  { label: "Achievements", href: "/achievements", ariaLabel: "Achievements", rotation: -8, hoverStyles: { bgColor: "#ff2fd0", textColor: "#ffffff" } },
  { label: "Team", href: "/team", ariaLabel: "Team", rotation: 8, hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" } },
  { label: "Gallery", href: "/gallery", ariaLabel: "Gallery", rotation: 6, hoverStyles: { bgColor: "#00e5ff", textColor: "#05080f" } },
  { label: "Announcements", href: "/announcements", ariaLabel: "Announcements", rotation: -6, hoverStyles: { bgColor: "#ff2fd0", textColor: "#ffffff" } },
  { label: "Portal", href: "/portal", ariaLabel: "Member portal", rotation: 8, hoverStyles: { bgColor: "#8b5cf6", textColor: "#ffffff" } },
  { label: "Contact", href: "/contact", ariaLabel: "Contact", rotation: -8, hoverStyles: { bgColor: "#00e5ff", textColor: "#05080f" } },
  { label: "Join AIMSA", href: "/join", ariaLabel: "Join AIMSA", rotation: 6, hoverStyles: { bgColor: "#ff2fd0", textColor: "#ffffff" } },
];

export function Header() {
  return (
    <>
      <AnnouncementBar />
      <BubbleMenu
        useFixedPosition
        items={items}
        menuAriaLabel="Toggle navigation"
        menuBg="oklch(0.16 0.03 265)"
        menuContentColor="#f3f6ff"
        animationEase="back.out(1.5)"
        animationDuration={0.5}
        staggerDelay={0.08}
        trailing={<ThemeToggle />}
        logo={
          <>
            <img src={logo.url} alt={site.name} className="bubble-logo h-7 w-auto" />
          </>
        }
      />
    </>
  );
}
