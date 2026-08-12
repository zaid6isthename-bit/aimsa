import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { bootstrapSchema, newAdminSchema, allowLoginAttempt, ROLES } from "./admin.server";

function clientIp(): string {
  const request = getRequest();
  return (
    request?.headers.get("cf-connecting-ip") ??
    request?.headers.get("x-forwarded-for") ??
    "anonymous"
  );
}

/** True when no administrator account exists yet (first-run setup). */
export const adminSetupRequired = createServerFn({ method: "GET" }).handler(async () => {
  const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
  const { count } = await supabaseAdmin
    .from("admin_profiles")
    .select("id", { count: "exact", head: true });
  return { setupRequired: (count ?? 0) === 0 };
});

/** Server-side login throttle. Called before every sign-in attempt. */
export const checkLoginRate = createServerFn({ method: "POST" }).handler(async () => {
  if (!allowLoginAttempt(clientIp())) {
    throw new Error("Too many login attempts. Please wait a few minutes and try again.");
  }
  return { ok: true as const };
});

/** Creates the first Super Admin. Refuses once any administrator exists. */
export const bootstrapSuperAdmin = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => bootstrapSchema.parse(data))
  .handler(async ({ data }) => {
    if (!allowLoginAttempt(clientIp())) throw new Error("Too many attempts. Try again later.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { count } = await supabaseAdmin
      .from("admin_profiles")
      .select("id", { count: "exact", head: true });
    if ((count ?? 0) > 0) throw new Error("Administrator accounts already exist.");

    const created = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name },
    });
    if (created.error || !created.data.user) throw new Error(created.error?.message ?? "Could not create account");
    const userId = created.data.user.id;

    await supabaseAdmin.from("admin_profiles").insert({
      id: userId,
      admin_id: data.adminId,
      name: data.name,
      email: data.email,
    });
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: "super_admin" });
    return { ok: true as const };
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function assertSuperAdmin(supabase: any, userId: string) {
  const { data } = await supabase.rpc("is_super_admin", { _user_id: userId });
  if (data !== true) throw new Error("Forbidden: Super Admin permission required.");
}

export const createAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: unknown) => newAdminSchema.parse(data))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

    const created = await supabaseAdmin.auth.admin.createUser({
      email: data.email,
      password: data.password,
      email_confirm: true,
      user_metadata: { name: data.name },
    });
    if (created.error || !created.data.user) throw new Error(created.error?.message ?? "Could not create account");
    const userId = created.data.user.id;

    const profile = await supabaseAdmin.from("admin_profiles").insert({
      id: userId,
      admin_id: data.adminId,
      name: data.name,
      email: data.email,
    });
    if (profile.error) {
      await supabaseAdmin.auth.admin.deleteUser(userId);
      throw new Error(profile.error.message);
    }
    await supabaseAdmin.from("user_roles").insert({ user_id: userId, role: data.role });
    return { ok: true as const, id: userId };
  });

export const setAdminRole = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string; role: (typeof ROLES)[number] }) => {
    if (!ROLES.includes(data.role)) throw new Error("Invalid role");
    return data;
  })
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.from("user_roles").delete().eq("user_id", data.userId);
    await supabaseAdmin.from("user_roles").insert({ user_id: data.userId, role: data.role });
    return { ok: true as const };
  });

export const deleteAdminAccount = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((data: { userId: string }) => data)
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.supabase, context.userId);
    if (data.userId === context.userId) throw new Error("You cannot remove your own account.");
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    await supabaseAdmin.auth.admin.deleteUser(data.userId);
    return { ok: true as const };
  });

/**
 * Signs in with a portal (Admin) ID. The ID is resolved to its account email
 * on the server, so administrator emails are never exposed to the browser.
 */
export const signInWithAdminId = createServerFn({ method: "POST" })
  .inputValidator((data: { adminId: string; password: string }) => {
    const adminId = String(data.adminId ?? "").trim();
    const password = String(data.password ?? "");
    if (adminId.length < 3 || adminId.length > 40) throw new Error("Invalid credentials.");
    if (password.length < 6 || password.length > 128) throw new Error("Invalid credentials.");
    return { adminId, password };
  })
  .handler(async ({ data }) => {
    const failure = { ok: false as const, message: "Invalid portal ID or password." };
    if (!allowLoginAttempt(clientIp())) {
      return { ok: false as const, message: "Too many login attempts. Please wait a few minutes and try again." };
    }
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const { data: profile } = await supabaseAdmin
      .from("admin_profiles")
      .select("email, active")
      .ilike("admin_id", data.adminId)
      .maybeSingle();
    if (!profile || !profile.active) return failure;

    const { createClient } = await import("@supabase/supabase-js");
    const key = process.env["SUPABASE_PUBLISHABLE_KEY"] ?? process.env["SUPABASE_ANON_KEY"]!;
    const client = createClient(process.env["SUPABASE_URL"]!, key, {
      auth: { persistSession: false },
      global: {
        fetch: (input: RequestInfo | URL, init?: RequestInit) => {
          const h = new Headers(init?.headers);
          if (key.startsWith("sb_") && h.get("Authorization") === `Bearer ${key}`) h.delete("Authorization");
          h.set("apikey", key);
          return fetch(input, { ...init, headers: h });
        },
      },
    });
    const signIn = await client.auth.signInWithPassword({
      email: profile.email,
      password: data.password,
    });
    if (signIn.error || !signIn.data.session) return failure;
    return {
      ok: true as const,
      accessToken: signIn.data.session.access_token,
      refreshToken: signIn.data.session.refresh_token,
    };
  });

export const recordLogin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await context.supabase
      .from("admin_profiles")
      .update({ last_login: new Date().toISOString() })
      .eq("id", context.userId);
    return { ok: true as const };
  });