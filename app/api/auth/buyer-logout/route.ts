import { NextResponse } from 'next/server';
import { clearBuyerCookie } from '@/lib/auth';

export async function POST() {
  const response = NextResponse.json({ success: true }, { status: 200 });
  response.headers.append('Set-Cookie', clearBuyerCookie());
  return response;
}
