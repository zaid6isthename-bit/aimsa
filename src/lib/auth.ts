import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'aimsa-admin-secret-key-change-in-production-2026'
);

const COOKIE_NAME = 'aimsa-admin-session';
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days

export interface AdminUser {
  id: string;
  username: string;
  name: string;
  email: string;
  role: string;
}

export interface JWTPayload {
  user: AdminUser;
}

const ROLE_PERMISSIONS: Record<string, string[]> = {
  super_admin: [
    'admin:read',
    'admin:write',
    'admin:delete',
    'event:read',
    'event:write',
    'event:delete',
    'announcement:read',
    'announcement:write',
    'announcement:delete',
    'team:read',
    'team:write',
    'team:delete',
    'project:read',
    'project:write',
    'project:delete',
    'achievement:read',
    'achievement:write',
    'achievement:delete',
    'gallery:read',
    'gallery:write',
    'gallery:delete',
    'settings:read',
    'settings:write',
    'activity:read',
  ],
  content_admin: [
    'event:read',
    'event:write',
    'announcement:read',
    'announcement:write',
    'team:read',
    'team:write',
    'project:read',
    'project:write',
    'achievement:read',
    'achievement:write',
    'gallery:read',
    'gallery:write',
  ],
  event_admin: [
    'event:read',
    'event:write',
    'announcement:read',
    'announcement:write',
    'gallery:read',
    'gallery:write',
  ],
};

export async function createToken(user: AdminUser): Promise<string> {
  const token = await new SignJWT({ user } satisfies JWTPayload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_MAX_AGE}s`)
    .sign(JWT_SECRET);
  return token;
}

export async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as unknown as JWTPayload;
  } catch {
    return null;
  }
}

export async function setSessionCookie(token: string): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: SESSION_MAX_AGE,
    path: '/',
  });
}

export async function getSessionCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  return cookie?.value || null;
}

export async function getCurrentUser(): Promise<AdminUser | null> {
  const token = await getSessionCookie();
  if (!token) return null;
  const payload = await verifyToken(token);
  return payload?.user || null;
}

export async function requireAuth(): Promise<AdminUser> {
  const user = await getCurrentUser();
  if (!user) {
    throw new Error('Unauthorized');
  }
  return user;
}

export function hasPermission(role: string, permission: string): boolean {
  const permissions = ROLE_PERMISSIONS[role];
  if (!permissions) return false;
  return permissions.includes(permission);
}

export async function requirePermission(permission: string): Promise<AdminUser> {
  const user = await requireAuth();
  if (!hasPermission(user.role, permission)) {
    throw new Error('Forbidden');
  }
  return user;
}

export async function logout(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export function getPermissionsForRole(role: string): string[] {
  return ROLE_PERMISSIONS[role] || [];
}
