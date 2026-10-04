import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export interface SessionUser {
  id: string;
  email: string;
  name: string;
  age?: number | null;
  gender?: string | null;
  bloodGroup?: string | null;
}

export const SESSION_COOKIE_NAME = '__Host-smartdr_session';
export const FALLBACK_COOKIE_NAME = 'smartdr_session';

function getSessionSecret(): string {
  if (process.env.SESSION_SECRET) return process.env.SESSION_SECRET;
  if (process.env.NEXTAUTH_SECRET) return process.env.NEXTAUTH_SECRET;
  // TODO(security): configure SESSION_SECRET in production environment
  console.warn('[AUTH SECURITY WARNING] SESSION_SECRET not set. Falling back to derived machine secret.');
  return crypto.createHash('sha256').update('smart-dr-default-secret-key-salt').digest('hex');
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function getUserByEmail(email: string) {
  return db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      name: true,
      age: true,
      gender: true,
      bloodGroup: true,
    }
  });
}

export async function createUser(data: { email: string; name: string; password: string; age?: number; gender?: string; bloodGroup?: string }) {
  const hashedPassword = await hashPassword(data.password);
  return db.user.create({
    data: {
      email: data.email.toLowerCase().trim(),
      name: data.name.trim(),
      password: hashedPassword,
      age: data.age,
      gender: data.gender,
      bloodGroup: data.bloodGroup,
    },
  });
}

/**
 * Creates a cryptographically signed session token (HMAC-SHA256)
 */
export function createSessionToken(user: SessionUser): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + (7 * 24 * 60 * 60); // 7 days expiration
  const payload = Buffer.from(JSON.stringify({
    sub: user.id,
    email: user.email,
    name: user.name,
    exp,
  })).toString('base64url');

  const secret = getSessionSecret();
  const signature = crypto.createHmac('sha256', secret)
    .update(`${header}.${payload}`)
    .digest('base64url');

  return `${header}.${payload}.${signature}`;
}

/**
 * Verifies a session token signature and expiration
 */
export function verifySessionToken(token: string): { sub: string; email: string; name: string } | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    const [header, payload, signature] = parts;

    const secret = getSessionSecret();
    const expectedSig = crypto.createHmac('sha256', secret)
      .update(`${header}.${payload}`)
      .digest('base64url');

    if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
      return null;
    }

    const decodedPayload = JSON.parse(Buffer.from(payload, 'base64url').toString('utf-8'));
    if (!decodedPayload.exp || decodedPayload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }

    return decodedPayload;
  } catch {
    return null;
  }
}

/**
 * Extracts and verifies the current session user from an HTTP request
 */
export async function getSessionUser(request: NextRequest): Promise<SessionUser | null> {
  const token = request.cookies.get(FALLBACK_COOKIE_NAME)?.value ||
                request.cookies.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const verified = verifySessionToken(token);
  if (!verified || !verified.sub) return null;

  const user = await getUserById(verified.sub);
  return user;
}

/**
 * Sets the secure HTTP-Only cookie on a NextResponse
 */
export function attachSessionCookie(response: NextResponse, user: SessionUser): void {
  const token = createSessionToken(user);
  const isProduction = process.env.NODE_ENV === 'production';

  response.cookies.set({
    name: FALLBACK_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 7 * 24 * 60 * 60,
    path: '/',
  });
}

/**
 * Clears the session cookie on a NextResponse
 */
export function clearSessionCookie(response: NextResponse): void {
  response.cookies.set({
    name: FALLBACK_COOKIE_NAME,
    value: '',
    httpOnly: true,
    maxAge: 0,
    path: '/',
  });
}
