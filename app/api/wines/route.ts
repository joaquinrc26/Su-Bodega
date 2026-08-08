import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

async function resolveDefaultCategoryId() {
 const defaultCategory = await prisma.productCategory.upsert({
   where: { slug: 'vino' },
   update: {},
   create: { slug: 'vino', name: 'Vino' },
 });

 return defaultCategory.id;
}

async function resolveCategoryId(input?: { categoryId?: string; categorySlug?: string; categoryName?: string }) {
 const hasCategoryInput = Boolean(input?.categoryId || input?.categorySlug || input?.categoryName);

 if (!hasCategoryInput) {
   return resolveDefaultCategoryId();
 }

 if (input?.categoryId) {
   const category = await prisma.productCategory.findUnique({ where: { id: input.categoryId } });
   if (category) return category.id;
 }

 const slug = input?.categorySlug?.trim() || '';
 if (slug) {
   const category = await prisma.productCategory.findUnique({ where: { slug } });
   if (category) return category.id;
 }

 const name = input?.categoryName?.trim() || '';
 if (name) {
   const category = await prisma.productCategory.findFirst({ where: { name } });
   if (category) return category.id;
 }

 return null;
}

export async function GET(request: Request) {
 const url = new URL(request.url);
 const id = url.searchParams.get('id');
 const year = url.searchParams.get('year');
 const grape = url.searchParams.get('grape');
 const region = url.searchParams.get('region');
 const category = url.searchParams.get('category');
 const includeInactive = url.searchParams.get('includeInactive') === '1';

 type WineWhere = {
   id?: string;
   year?: number;
   region?: string;
   grapeType?: { name: string };
   category?: { slug: string };
   isActive?: boolean;
 };

 const where: WineWhere = {};
 if (id) where.id = id;
 if (year) where.year = parseInt(year, 10);
 if (grape) where.grapeType = { name: grape };
 if (region) where.region = region;
 if (category) where.category = { slug: category };
 if (!includeInactive) where.isActive = true;

 const wines = await prisma.wine.findMany({
 where,
 include: { grapeType: true, photos: true, category: true },
 orderBy: [{ year: 'desc' }, { createdAt: 'desc' }],
 });
 return NextResponse.json(wines);
}

export async function POST(request: Request) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 const body = await request.json();
 const { name, year, description, price, stock, region, bodega, maridaje, grapeTypeId, grapeTypeName, photos, categoryId, categorySlug, categoryName, isActive } = body;

 if (!name || !year) {
 return new Response('Missing name or year', { status: 400 });
 }

 const parsedYear = Number(year);
 if (!Number.isInteger(parsedYear) || parsedYear < 1900) {
 return new Response('Invalid year', { status: 400 });
 }

 const parsedPrice = Number(price ?? 0);
 const parsedStock = Number(stock ?? 0);

 if (Number.isNaN(parsedPrice) || parsedPrice < 0) {
 return new Response('Invalid price', { status: 400 });
 }

 if (Number.isNaN(parsedStock) || parsedStock < 0 || !Number.isInteger(parsedStock)) {
 return new Response('Invalid stock', { status: 400 });
 }

 if (typeof isActive !== 'boolean' && typeof isActive !== 'undefined') {
 return new Response('Invalid status', { status: 400 });
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

 const resolvedCategoryId = await resolveCategoryId({ categoryId, categorySlug, categoryName });

 if (!resolvedCategoryId) {
 return new Response('Invalid category', { status: 400 });
 }

 const createdWine = await prisma.wine.create({
 data: {
 name,
 year: parsedYear,
 description,
 price: parsedPrice,
 stock: parsedStock,
 isActive: typeof isActive === 'boolean' ? isActive : true,
 region: region || 'Sin especificar',
 bodega: bodega || undefined,
 maridaje: maridaje || 'Versatile',
 categoryId: resolvedCategoryId,
 grapeTypeId: grapeId,
 photos: {
 create: Array.isArray(photos)
 ? photos.map((url: string) => ({ url }))
 : [],
 },
 },
 include: { grapeType: true, photos: true, category: true },
 });

 return NextResponse.json(createdWine, { status: 201 });
 } catch {
 return new Response('Server error', { status: 500 });
 }
}
