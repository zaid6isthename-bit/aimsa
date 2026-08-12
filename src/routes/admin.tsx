import { createFileRoute, Outlet, useNavigate, useRouterState } from "@tanstack/react-router";
import { useEffect } from "react";
import { AdminShell } from "@/components/admin/AdminShell";
import { useAdmin } from "@/lib/cms/useAdmin";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "AIMSA Admin Portal" },
      { name: "robots", content: "noindex, nofollow" },
      { name: "description", content: "Private content management portal for AIMSA administrators." },
    ],
  }),
  component: AdminLayout,
});

function AdminLayout() {
  const identity = useAdmin();
  const navigate = useNavigate();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (identity.loading || isLogin) return;
    if (!identity.session) {
      void navigate({ to: "/admin/login", replace: true });
      return;
    }
    if (identity.profile && identity.profile.active === false) {
      void navigate({ to: "/admin/login", search: { disabled: "1" }, replace: true });
    }
  }, [identity, isLogin, navigate]);

  if (isLogin) return <Outlet />;

  if (identity.loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-background text-sm text-muted-foreground">
        Checking your session…
      </div>
    );
  }

  if (!identity.session) return null;

  if (!identity.role) {
    return (
      <div className="grid min-h-screen place-items-center bg-background px-6 text-center">
        <div className="max-w-md">
          <h1 className="text-xl font-semibold text-foreground">No permissions assigned</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your account exists but has no administrator role yet. Ask a Super Admin to assign one.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminShell identity={identity}>
      <Outlet />
    </AdminShell>
  );
}