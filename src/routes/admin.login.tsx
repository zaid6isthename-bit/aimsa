import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Lock } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  adminSetupRequired,
  bootstrapSuperAdmin,
  recordLogin,
  signInWithAdminId,
} from "@/lib/cms/admin.functions";
import logo from "@/assets/aimsa-wordmark.png.asset.json";
import { ArtBackdrop } from "@/components/site/ArtBackdrop";
import { bgFor } from "@/assets/bg";

export const Route = createFileRoute("/admin/login")({
  ssr: false,
  validateSearch: (search: Record<string, unknown>): { expired?: string; disabled?: string } => {
    const out: { expired?: string; disabled?: string } = {};
    if (typeof search["expired"] === "string") out.expired = search["expired"];
    if (typeof search["disabled"] === "string") out.disabled = search["disabled"];
    return out;
  },
  head: () => ({
    meta: [
      { title: "Sign in — AIMSA Admin" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Administrator sign-in for the AIMSA website content portal." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const { expired, disabled } = Route.useSearch();
  const [email, setEmail] = useState("");
  const [adminId, setAdminId] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [setupName, setSetupName] = useState("");
  const [setupAdminId, setSetupAdminId] = useState("");

  const setup = useQuery({
    queryKey: ["admin-setup-required"],
    queryFn: () => adminSetupRequired(),
  });

  useEffect(() => {
    if (expired) toast.info("Your session expired. Please sign in again.");
    if (disabled) toast.error("This administrator account has been deactivated.");
  }, [expired, disabled]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      const session = await signInWithAdminId({ data: { adminId: adminId.trim(), password } });
      if (!session.ok) {
        toast.error(session.message);
        return;
      }
      const { error } = await supabase.auth.setSession({
        access_token: session.accessToken,
        refresh_token: session.refreshToken,
      });
      if (error) throw new Error("Could not start your session. Please try again.");
      await recordLogin().catch(() => undefined);
      toast.success("Welcome back");
      void navigate({ to: "/admin/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Sign-in failed");
    } finally {
      setBusy(false);
    }
  };

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      await bootstrapSuperAdmin({
        data: { name: setupName, email: email.trim(), adminId: setupAdminId, password },
      });
      const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (error) throw new Error(error.message);
      toast.success("Super Admin account created");
      void navigate({ to: "/admin/dashboard", replace: true });
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Setup failed");
    } finally {
      setBusy(false);
    }
  };

  const needsSetup = setup.data?.setupRequired === true;

  return (
    <main className="relative isolate overflow-hidden grid min-h-screen place-items-center bg-background px-4 py-10 sm:px-6 sm:py-16">
      <ArtBackdrop image={bgFor("admin:login")} opacity={0.4} position="center 40%" />
      <div className="relative w-full max-w-md rounded-2xl border border-border bg-card/95 p-6 shadow-2xl backdrop-blur-xl sm:bg-card/80 sm:p-8">
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 rounded-2xl bg-background/40 sm:hidden" />
        <img src={logo.url} alt="AIMSA" className="mx-auto h-8 w-auto" />
        <h1 className="mt-6 text-center text-xl font-semibold text-foreground">
          {needsSetup ? "Create the first Super Admin" : "Administrator sign-in"}
        </h1>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {needsSetup
            ? "No administrator exists yet. Set up the primary account to manage the AIMSA website."
            : "Restricted area. Sign in with your AIMSA portal ID."}
        </p>

        <form className="mt-7 space-y-4" onSubmit={needsSetup ? handleSetup : handleSignIn}>
          {needsSetup ? (
            <>
              <div>
                <Label htmlFor="name" className="mb-2 block">Full name</Label>
                <Input id="name" required value={setupName} onChange={(e) => setSetupName(e.target.value)} />
              </div>
              <div>
                <Label htmlFor="adminId" className="mb-2 block">Admin ID</Label>
                <Input
                  id="adminId"
                  required
                  value={setupAdminId}
                  onChange={(e) => setSetupAdminId(e.target.value)}
                  placeholder="aimsa-admin"
                />
              </div>
            </>
          ) : null}

          {needsSetup ? (
            <div>
              <Label htmlFor="email" className="mb-2 block">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          ) : (
            <div>
              <Label htmlFor="portalId" className="mb-2 block">Portal ID</Label>
              <Input
                id="portalId"
                autoComplete="username"
                required
                placeholder="aimsa-events"
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
              />
            </div>
          )}
          <div>
            <Label htmlFor="password" className="mb-2 block">Password</Label>
            <Input
              id="password"
              type="password"
              autoComplete={needsSetup ? "new-password" : "current-password"}
              required
              minLength={needsSetup ? 10 : undefined}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {needsSetup ? (
              <p className="mt-1.5 text-xs text-muted-foreground">Use at least 10 characters.</p>
            ) : null}
          </div>

          <Button type="submit" className="w-full" disabled={busy || setup.isLoading}>
            {busy ? <Loader2 className="size-4 animate-spin" /> : <Lock className="size-4" />}
            {needsSetup ? "Create account" : "Sign in"}
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Sessions end automatically after 60 minutes of inactivity.
        </p>
      </div>
    </main>
  );
}