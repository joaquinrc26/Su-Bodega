import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

export async function GET() {
 const categories = await prisma.productCategory.findMany({
   where: { isActive: true },
   orderBy: [{ name: 'asc' }],
 });

 return NextResponse.json(categories);
}

export async function POST(request: Request) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 const body = await request.json();
 const { name, slug, description } = body || {};

 if (!name || !slug) {
 return new Response('Missing name or slug', { status: 400 });
 }

 try {
 const category = await prisma.productCategory.create({
   data: {
     name,
     slug,
     description: description || undefined,
   },
 });

 return NextResponse.json(category, { status: 201 });
 } catch (error) {
 const message = error instanceof Error ? error.message : 'Server error';
 return new Response(message, { status: 500 });
 }
}