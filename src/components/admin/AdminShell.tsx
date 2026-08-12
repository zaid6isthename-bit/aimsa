import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import {
  LayoutDashboard,
  CalendarDays,
  Megaphone,
  Users,
  FolderGit2,
  Trophy,
  Images,
  FileImage,
  SlidersHorizontal,
  ShieldCheck,
  History,
  LogOut,
  Menu,
  ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { permissions, roleLabels, type AdminIdentity } from "@/lib/cms/useAdmin";
import { cn } from "@/lib/utils";
import logo from "@/assets/aimsa-wordmark.png.asset.json";

const IDLE_TIMEOUT_MS = 60 * 60_000;

interface NavItem {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  visible: (p: ReturnType<typeof permissions>) => boolean;
}

const navItems: NavItem[] = [
  { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard, visible: () => true },
  { to: "/admin/events", label: "Events", icon: CalendarDays, visible: (p) => p.manageEvents },
  { to: "/admin/announcements", label: "Announcements", icon: Megaphone, visible: (p) => p.manageContent },
  { to: "/admin/team", label: "Team", icon: Users, visible: (p) => p.manageContent },
  { to: "/admin/projects", label: "Projects", icon: FolderGit2, visible: (p) => p.manageContent },
  { to: "/admin/achievements", label: "Achievements", icon: Trophy, visible: (p) => p.manageContent },
  { to: "/admin/gallery", label: "Gallery", icon: Images, visible: (p) => p.manageEvents },
  { to: "/admin/media", label: "Media library", icon: FileImage, visible: (p) => p.manageMedia },
  { to: "/admin/pages", label: "Site content", icon: SlidersHorizontal, visible: (p) => p.manageContent },
  { to: "/admin/admins", label: "Administrators", icon: ShieldCheck, visible: (p) => p.manageAdmins },
  { to: "/admin/activity", label: "Activity log", icon: History, visible: () => true },
];

export function AdminShell({ identity, children }: { identity: AdminIdentity; children: ReactNode }) {
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [open, setOpen] = useState(false);
  const perms = permissions(identity.role);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const signOut = async (reason?: string) => {
    await supabase.auth.signOut();
    navigate({ to: "/admin/login", search: reason ? { expired: "1" } : {}, replace: true } as never);
  };

  useEffect(() => {
    const reset = () => {
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => void signOut("idle"), IDLE_TIMEOUT_MS);
    };
    reset();
    const events = ["mousemove", "keydown", "click", "scroll"] as const;
    events.forEach((e) => window.addEventListener(e, reset, { passive: true }));
    return () => {
      if (timer.current) clearTimeout(timer.current);
      events.forEach((e) => window.removeEventListener(e, reset));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-64 shrink-0 border-r border-border bg-card/95 backdrop-blur transition-transform lg:static lg:translate-x-0",
            open ? "translate-x-0" : "-translate-x-full",
          )}
        >
          <div className="flex h-full flex-col">
            <div className="border-b border-border px-5 py-5">
              <img src={logo.url} alt="AIMSA" className="h-6 w-auto" />
              <p className="mt-2 text-[0.68rem] font-semibold uppercase tracking-[0.28em] text-muted-foreground">
                Admin Portal
              </p>
            </div>
            <nav className="flex-1 space-y-1 overflow-y-auto p-3">
              {navItems
                .filter((item) => item.visible(perms))
                .map((item) => {
                  const active = pathname === item.to;
                  return (
                    <Link
                      key={item.to}
                      to={item.to}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        active
                          ? "bg-primary/15 text-primary"
                          : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
                      )}
                    >
                      <item.icon className="size-4" aria-hidden="true" />
                      {item.label}
                    </Link>
                  );
                })}
            </nav>
            <div className="space-y-3 border-t border-border p-4">
              <div className="text-sm">
                <p className="font-semibold text-foreground">{identity.profile?.name ?? "Administrator"}</p>
                <p className="text-xs text-muted-foreground">
                  {identity.role ? roleLabels[identity.role] : "No role assigned"}
                </p>
              </div>
              <a
                href="/"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
              >
                <ExternalLink className="size-3.5" aria-hidden="true" /> View public website
              </a>
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={() => {
                  toast.success("Signed out");
                  void signOut();
                }}
              >
                <LogOut className="size-4" aria-hidden="true" /> Sign out
              </Button>
            </div>
          </div>
        </aside>

        {open ? (
          <button
            aria-label="Close navigation"
            className="fixed inset-0 z-40 bg-black/60 lg:hidden"
            onClick={() => setOpen(false)}
          />
        ) : null}

        <div className="min-w-0 flex-1">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-background/90 px-4 py-3 backdrop-blur lg:hidden">
            <Button variant="ghost" size="icon" onClick={() => setOpen(true)} aria-label="Open navigation">
              <Menu className="size-5" />
            </Button>
            <span className="text-sm font-semibold">AIMSA Admin</span>
          </header>
          <main className="px-4 py-8 sm:px-8">{children}</main>
        </div>
      </div>
    </div>
  );
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}