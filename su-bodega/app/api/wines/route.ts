import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

export async function GET(request: Request) {
 const url = new URL(request.url);
 const year = url.searchParams.get('year');
 const grape = url.searchParams.get('grape');

 type WineWhere = {
   year?: number;
   grapeType?: { name: string };
 };

 const where: WineWhere = {};
 if (year) where.year = parseInt(year, 10);
 if (grape) where.grapeType = { name: grape };

 const wines = await prisma.wine.findMany({
 where,
 include: { grapeType: true, photos: true },
 orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
 });
 return NextResponse.json(wines);
}

export async function POST(request: Request) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 const body = await request.json();
 const { name, year, description, price, region, bodega, maridaje, grapeTypeId, grapeTypeName, photos } = body;

 if (!name || !year) {
 return new Response('Missing name or year', { status: 400 });
 }

 try {
 let grapeId = grapeTypeId;
 if (!grapeId && grapeTypeName) {
 const existing = await prisma.grapeType.findUnique({ where: { name: grapeTypeName } });
 if (existing) grapeId = existing.id;
 else {
 const created = await prisma.grapeType.create({ data: { name: grapeTypeName } });
 grapeId = created.id;
 }
 }

 const createdWine = await prisma.wine.create({
 data: {
 name,
 year: Number(year),
 description,
 price: price ? parseFloat(price) : 0,
 region: region || 'Sin especificar',
 bodega: bodega || undefined,
 maridaje: maridaje || 'Versatile',
 grapeTypeId: grapeId,
 photos: {
 create: Array.isArray(photos)
 ? photos.map((url: string) => ({ url }))
 : [],
 },
 },
 include: { grapeType: true, photos: true },
 });

 return NextResponse.json(createdWine, { status: 201 });
 } catch {
 return new Response('Server error', { status: 500 });
 }
}
