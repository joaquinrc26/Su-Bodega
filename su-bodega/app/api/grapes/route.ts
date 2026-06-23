import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

export async function GET() {
 const grapes = await prisma.grapeType.findMany({ orderBy: { name: 'asc' } });
 return NextResponse.json(grapes);
}

export async function POST(request: Request) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 const body = await request.json();
 const { name } = body;
 if (!name) {
 return new Response('Missing name', { status: 400 });
 }

 try {
 const grape = await prisma.grapeType.create({ data: { name } });
 return NextResponse.json(grape, { status: 201 });
 } catch (err) {
 if ((err as { code?: string })?.code === 'P2002') {
 return new Response('Grape type already exists', { status: 409 });
 }
 return new Response('Server error', { status: 500 });
 }
}
