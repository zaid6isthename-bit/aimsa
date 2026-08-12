import { Link } from "@tanstack/react-router";
import { Lock, Mail, MapPin } from "lucide-react";
import { navLinks, site } from "@/content/site";
import { copy } from "@/lib/cms/store";
import { publishedEvents } from "@/lib/content";
import { Logo } from "./Logo";
import footerArt from "@/assets/footer-art.png.asset.json";

export function Footer() {
  const featuredEvents = publishedEvents().slice(0, 4);

  return (
    <footer className="footer-aurora mt-24 border-t border-border">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-20">
        <img
          src={footerArt.url}
          alt=""
          loading="lazy"
          className="h-full w-full object-cover object-center opacity-45"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/40 to-background" />
      </div>
      <div aria-hidden="true" className="footer-wordmark">
        AIMSA
      </div>
      <div className="container-aimsa grid gap-12 py-20 md:grid-cols-2 lg:grid-cols-4 lg:gap-10">
        <div className="space-y-4 lg:col-span-1">
          <Logo />
          <p className="text-sm font-medium text-accent">{copy("global.tagline")}</p>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {copy("global.fullName")}, {copy("global.college")}, {copy("global.campus")}.
          </p>
        </div>

        <nav aria-label="Footer" className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground">Explore</h2>
          <span className="footer-rule" aria-hidden="true" />
          <ul className="space-y-2.5 pt-1 text-sm">
            {navLinks.map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-foreground/85 hover:text-primary">
                  {l.label}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link
                to="/admin/login"
                className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-foreground transition hover:border-primary hover:bg-primary/20 hover:text-primary"
                data-cursor="Sign in"
              >
                <Lock className="size-3.5" aria-hidden="true" />
                Member sign in
              </Link>
            </li>
          </ul>
        </nav>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground">Events</h2>
          <span className="footer-rule" aria-hidden="true" />
          <ul className="space-y-2.5 pt-1 text-sm">
            {featuredEvents.map((e) => (
              <li key={e.slug}>
                <Link
                  to="/events/$slug"
                  params={{ slug: e.slug }}
                  className="text-foreground/85 hover:text-primary"
                >
                  {e.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-[0.22em] text-foreground">Reach us</h2>
          <span className="footer-rule" aria-hidden="true" />
          <ul className="space-y-4 pt-1 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>{site.contact.address}</span>
            </li>
            <li className="flex gap-2">
              <Mail className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <span>
                {site.contact.email ? (
                  <a href={`mailto:${site.contact.email}`} className="hover:text-primary">
                    {site.contact.email}
                  </a>
                ) : (
                  <>
                    Official email to be announced —{" "}
                    <Link to="/contact" className="text-foreground underline underline-offset-4">
                      use the contact form
                    </Link>
                  </>
                )}
              </span>
            </li>
          </ul>
          {site.socials.length > 0 ? (
            <ul className="flex gap-3 pt-1">
              {site.socials.map((s) => (
                <li key={s.href}>
                  <a href={s.href} className="text-sm text-foreground/85 hover:text-primary">
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          ) : null}
        </div>
      </div>

      <div className="trace-divider" />
      <div className="container-aimsa flex flex-col items-center justify-between gap-3 py-6 text-xs text-muted-foreground sm:flex-row">
        <p>
          © {new Date().getFullYear()} {copy("global.name")} · {copy("global.college")}
        </p>
        <p className="tracking-[0.16em] uppercase">{copy("global.motto")}</p>
      </div>
    </footer>
  );
}
