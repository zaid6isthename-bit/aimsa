import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { AdminRole } from "./admin.server";

export interface AdminProfile {
  id: string;
  admin_id: string;
  name: string;
  email: string;
  active: boolean;
  last_login: string | null;
  created_at: string;
}

export interface AdminIdentity {
  loading: boolean;
  session: Session | null;
  profile: AdminProfile | null;
  role: AdminRole | null;
}

export const roleLabels: Record<AdminRole, string> = {
  super_admin: "Super Admin",
  content_admin: "Content Admin",
  event_admin: "Event Admin",
};

export function permissions(role: AdminRole | null) {
  return {
    isSuperAdmin: role === "super_admin",
    manageContent: role === "super_admin" || role === "content_admin",
    manageEvents: role === "super_admin" || role === "content_admin" || role === "event_admin",
    manageMedia: role === "super_admin" || role === "content_admin" || role === "event_admin",
    manageAdmins: role === "super_admin",
  };
}

export function useAdmin(): AdminIdentity {
  const [state, setState] = useState<AdminIdentity>({
    loading: true,
    session: null,
    profile: null,
    role: null,
  });

  useEffect(() => {
    let cancelled = false;

    const load = async (session: Session | null) => {
      if (!session) {
        if (!cancelled) setState({ loading: false, session: null, profile: null, role: null });
        return;
      }
      const [{ data: profile }, { data: roles }] = await Promise.all([
        supabase.from("admin_profiles").select("*").eq("id", session.user.id).maybeSingle(),
        supabase.from("user_roles").select("role").eq("user_id", session.user.id),
      ]);
      if (cancelled) return;
      setState({
        loading: false,
        session,
        profile: (profile as AdminProfile | null) ?? null,
        role: (roles?.[0]?.role as AdminRole | undefined) ?? null,
      });
    };

    supabase.auth.getSession().then(({ data }) => load(data.session));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        void load(session);
      }
    });

    return () => {
      cancelled = true;
      sub.subscription.unsubscribe();
    };
  }, []);

  return state;
}