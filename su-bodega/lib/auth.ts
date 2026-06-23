import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'crypto';

export const ADMIN_COOKIE_NAME = 'su-bodega-admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
export const BUYER_COOKIE_NAME = 'su-bodega-buyer';

const PASSWORD_PREFIX = 'scrypt';

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derivedKey = scryptSync(password, salt, 64).toString('hex');
  return `${PASSWORD_PREFIX}$${salt}$${derivedKey}`;
}

export function verifyPassword(password: string, storedPassword: string): boolean {
  if (!storedPassword) return false;

  if (!storedPassword.startsWith(`${PASSWORD_PREFIX}$`)) {
    return password === storedPassword;
  }

  const [, salt, derivedKey] = storedPassword.split('$');
  if (!salt || !derivedKey) return false;

  const actualKey = scryptSync(password, salt, 64);
  const expectedKey = Buffer.from(derivedKey, 'hex');

  if (actualKey.length !== expectedKey.length) return false;

  return timingSafeEqual(actualKey, expectedKey);
}

function signCookieValue(value: string): string {
  const secret = process.env.AUTH_COOKIE_SECRET || ADMIN_PASSWORD;
  const signature = createHash('sha256').update(`${value}.${secret}`).digest('hex');
  return `${value}.${signature}`;
}

function verifyCookieValue(token: string | null | undefined): boolean {
  if (!token) return false;

  const [value, signature] = token.split('.');
  if (!value || !signature) return false;

  const secret = process.env.AUTH_COOKIE_SECRET || ADMIN_PASSWORD;
  const expectedSignature = createHash('sha256').update(`${value}.${secret}`).digest('hex');
  return signature === expectedSignature;
}

export function parseCookies(cookieHeader: string | null | undefined) {
  if (!cookieHeader) return {};
  return Object.fromEntries(
    cookieHeader.split(';').map((cookie) => {
      const [name, ...rest] = cookie.trim().split('=');
      return [name, rest.join('=')];
    })
  );
}

export function isAdminToken(token: string | null | undefined): boolean {
  if (!token) return false;
  if (token === ADMIN_PASSWORD) return true;
  return verifyCookieValue(token);
}

export function isAdminRequest(request: Request): boolean {
  const cookies = parseCookies(request.headers.get('cookie'));
  return isAdminToken(cookies[ADMIN_COOKIE_NAME]);
}

export function createAdminCookie(): string {
  return `${ADMIN_COOKIE_NAME}=${signCookieValue(ADMIN_PASSWORD)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

export function clearAdminCookie(): string {
  return `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isBuyerToken(token: string | null | undefined): boolean {
  if (!token) return false;
  if (!token.includes('.')) return true;
  return verifyCookieValue(token);
}

export function isBuyerRequest(request: Request): boolean {
  const cookies = parseCookies(request.headers.get('cookie'));
  return isBuyerToken(cookies[BUYER_COOKIE_NAME]);
}

export function getBuyerIdFromCookie(request: Request): string | null {
  const cookies = parseCookies(request.headers.get('cookie'));
  const token = cookies[BUYER_COOKIE_NAME];
  if (!token) return null;
  return token.split('.')[0] || token;
}

export function createBuyerCookie(buyerId: string): string {
  return `${BUYER_COOKIE_NAME}=${signCookieValue(buyerId)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

export function clearBuyerCookie(): string {
  return `${BUYER_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
