import type { Context, Next } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';
import { createContext, useContext } from 'hono/jsx';
import type { D1Database } from './types';

// -- Auth context (for JSX components) --

export const AuthContext = createContext<AuthUser | null>(null);

export function useAuth(): AuthUser | null {
  return useContext(AuthContext);
}

// -- Types --

export type Role = 'admin' | 'member';

export interface AuthUser {
  email: string;
  role: Role;
}

// -- Helpers --

function getSecret(c: Context): string {
  const secret = (c.env as Record<string, string>).JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is not configured');
  return secret;
}

// -- Code generation (6 alphanumeric chars, rejection sampling to avoid modulo bias) --

const CODE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const CODE_LENGTH = 6;
const CODE_TTL_MINUTES = 15;
// Largest multiple of 36 that fits in a byte (252 = 36 * 7)
const CODE_CHAR_LIMIT = 252;

export function generateCode(): string {
  const result: string[] = [];
  while (result.length < CODE_LENGTH) {
    const array = new Uint8Array(CODE_LENGTH - result.length);
    crypto.getRandomValues(array);
    for (const b of array) {
      if (b < CODE_CHAR_LIMIT && result.length < CODE_LENGTH) {
        result.push(CODE_CHARS[b % CODE_CHARS.length]);
      }
    }
  }
  return result.join('');
}

export function formatCode(code: string): string {
  return `${code.slice(0, 3)}-${code.slice(3)}`;
}

// -- JWT (HMAC-SHA256, minimal, no dependency) --

function base64url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function base64urlDecode(s: string): Uint8Array {
  const padded = s.replace(/-/g, '+').replace(/_/g, '/') + '=='.slice(0, (4 - (s.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function hmacKey(secret: string): Promise<CryptoKey> {
  const enc = new TextEncoder();
  return crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signJwt(payload: Record<string, unknown>, secret: string, expiresInDays = 30): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const body = { ...payload, iat: now, exp: now + expiresInDays * 86400 };
  const enc = new TextEncoder();
  const headerB64 = base64url(enc.encode(JSON.stringify(header)).buffer as ArrayBuffer);
  const bodyB64 = base64url(enc.encode(JSON.stringify(body)).buffer as ArrayBuffer);
  const data = `${headerB64}.${bodyB64}`;
  const key = await hmacKey(secret);
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(data));
  return `${data}.${base64url(sig)}`;
}

export async function verifyJwt(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [headerB64, bodyB64, sigB64] = parts;
  const key = await hmacKey(secret);
  const enc = new TextEncoder();
  const valid = await crypto.subtle.verify('HMAC', key, base64urlDecode(sigB64).buffer as ArrayBuffer, enc.encode(`${headerB64}.${bodyB64}`));
  if (!valid) return null;
  const payload = JSON.parse(new TextDecoder().decode(base64urlDecode(bodyB64)));
  if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) return null;
  return payload;
}

// -- HMAC for redirect URLs --

export async function signRedirect(redirect: string, secret: string): Promise<string> {
  const key = await hmacKey(secret);
  const enc = new TextEncoder();
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(redirect));
  return base64url(sig);
}

export async function verifyRedirect(redirect: string, sig: string, secret: string): Promise<boolean> {
  const key = await hmacKey(secret);
  const enc = new TextEncoder();
  return crypto.subtle.verify('HMAC', key, base64urlDecode(sig).buffer as ArrayBuffer, enc.encode(redirect));
}

// -- Magic link token (signed code + redirect, like orius-auth) --

export async function signToken(code: string, redirect: string, secret: string): Promise<string> {
  return signJwt({ code, redirect, purpose: 'signin' }, secret, 1);
}

export async function verifyToken(token: string, secret: string): Promise<{ code: string; redirect: string } | null> {
  const payload = await verifyJwt(token, secret);
  if (!payload || payload.purpose !== 'signin') return null;
  return { code: payload.code as string, redirect: (payload.redirect as string) || '/' };
}

// -- Database operations --

export async function isRegistered(db: D1Database, email: string): Promise<boolean> {
  const row = await db.prepare('SELECT email FROM users WHERE email = ?').bind(email).first();
  return row !== null;
}

export async function getUserRole(db: D1Database, email: string): Promise<Role | null> {
  const row = await db.prepare('SELECT role FROM users WHERE email = ?').bind(email).first();
  return row ? (row.role as Role) : null;
}

export async function storeCode(db: D1Database, email: string, code: string): Promise<void> {
  await db.prepare('DELETE FROM signin_codes WHERE email = ?').bind(email).run();
  const expiresAt = new Date(Date.now() + CODE_TTL_MINUTES * 60 * 1000).toISOString();
  await db.prepare('INSERT INTO signin_codes (code, email, expires_at) VALUES (?, ?, ?)').bind(code, email, expiresAt).run();
}

export async function verifyCode(db: D1Database, code: string): Promise<string | null> {
  // Atomic: DELETE RETURNING ensures one-use even under concurrent requests
  const row = await db.prepare(
    "DELETE FROM signin_codes WHERE code = ? AND expires_at > datetime('now') RETURNING email"
  ).bind(code).first();
  return row ? (row.email as string) : null;
}

export async function cleanupExpiredCodes(db: D1Database): Promise<void> {
  await db.prepare("DELETE FROM signin_codes WHERE expires_at <= datetime('now')").run();
}

// -- Session cookie --

const COOKIE_NAME = 'session';

export async function setSession(c: Context, user: AuthUser): Promise<void> {
  const secret = getSecret(c);
  const token = await signJwt({ email: user.email, role: user.role }, secret, 30);
  setCookie(c, COOKIE_NAME, token, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 30 * 24 * 60 * 60,
  });
}

export function clearSession(c: Context): void {
  deleteCookie(c, COOKIE_NAME, { path: '/' });
}

export async function getSession(c: Context): Promise<AuthUser | null> {
  const token = getCookie(c, COOKIE_NAME);
  if (!token) return null;
  const secret = getSecret(c);
  const payload = await verifyJwt(token, secret);
  if (!payload || !payload.email || !payload.role) return null;
  return { email: payload.email as string, role: payload.role as Role };
}

// -- Middleware --

export function requireAuth(minRole?: Role) {
  return async (c: Context, next: Next) => {
    const user = await getSession(c);
    if (!user) {
      const loginUrl = `/login?redirect=${encodeURIComponent(c.req.path)}`;
      return c.redirect(loginUrl);
    }
    if (minRole === 'admin' && user.role !== 'admin') {
      return c.html('<h1>403 Forbidden</h1>', 403);
    }
    c.set('user', user);
    return next();
  };
}

// -- Email --

interface EmailConfig {
  scwSecretKey: string;
  scwProjectId: string;
  fromEmail: string;
}

export async function sendSigninEmail(
  email: string,
  code: string,
  magicLinkUrl: string,
  config: EmailConfig
): Promise<boolean> {
  const formatted = formatCode(code);
  const subject = `Your sign-in code: ${formatted}`;

  const html = `
<div style="font-family: -apple-system, BlinkMacSystemFont, sans-serif; max-width: 480px; margin: 0 auto; padding: 40px 20px;">
  <p style="color: #333; font-size: 16px; line-height: 1.5;">Here is your sign-in code. You can copy it into the open browser window or click the button below.</p>
  <div style="background: #f5f5f5; border-radius: 8px; padding: 24px; text-align: center; margin: 24px 0;">
    <span style="font-family: monospace; font-size: 32px; letter-spacing: 4px; color: #000;">${formatted}</span>
  </div>
  <div style="text-align: center; margin: 24px 0;">
    <a href="${magicLinkUrl}" style="background: #181818; color: #fff; padding: 12px 32px; text-decoration: none; border-radius: 4px; font-size: 14px; display: inline-block;">CONFIRM AND SIGN IN</a>
  </div>
  <p style="color: #999; font-size: 13px; line-height: 1.5;">If you didn't request this code, you can ignore this email.<br>This link expires in 15 minutes.</p>
</div>`;

  const text = `Your sign-in code: ${formatted}\n\nOr click this link: ${magicLinkUrl}\n\nThis code expires in 15 minutes. If you didn't request it, ignore this email.`;

  const res = await fetch('https://api.scaleway.com/transactional-email/v1alpha1/regions/fr-par/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Auth-Token': config.scwSecretKey,
    },
    body: JSON.stringify({
      from: { email: config.fromEmail, name: 'jvelo.at' },
      to: [{ email }],
      subject,
      text,
      html,
      project_id: config.scwProjectId,
    }),
  });

  if (!res.ok) {
    console.error('Email send error:', res.status, await res.text());
  }
  return res.ok;
}
