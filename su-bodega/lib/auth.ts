export const ADMIN_COOKIE_NAME = 'su-bodega-admin';
export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
export const BUYER_COOKIE_NAME = 'su-bodega-buyer';

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
  return Boolean(token && token === ADMIN_PASSWORD);
}

export function isAdminRequest(request: Request): boolean {
  const cookies = parseCookies(request.headers.get('cookie'));
  return isAdminToken(cookies[ADMIN_COOKIE_NAME]);
}

export function createAdminCookie(): string {
  return `${ADMIN_COOKIE_NAME}=${ADMIN_PASSWORD}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

export function clearAdminCookie(): string {
  return `${ADMIN_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}

export function isBuyerToken(token: string | null | undefined): boolean {
  return Boolean(token && token.length > 0);
}

export function isBuyerRequest(request: Request): boolean {
  const cookies = parseCookies(request.headers.get('cookie'));
  return isBuyerToken(cookies[BUYER_COOKIE_NAME]);
}

export function getBuyerIdFromCookie(request: Request): string | null {
  const cookies = parseCookies(request.headers.get('cookie'));
  return cookies[BUYER_COOKIE_NAME] || null;
}

export function createBuyerCookie(buyerId: string): string {
  return `${BUYER_COOKIE_NAME}=${buyerId}; Path=/; HttpOnly; SameSite=Lax; Max-Age=604800`;
}

export function clearBuyerCookie(): string {
  return `${BUYER_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`;
}
