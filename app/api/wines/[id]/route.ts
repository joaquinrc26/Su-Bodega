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

export async function GET(_request: Request, { params }: { params: { id: string } }) {
 const { id } = params;
 const includeInactive = new URL(_request.url).searchParams.get('includeInactive') === '1';

 const wine = await prisma.wine.findUnique({
   where: { id },
   include: { grapeType: true, photos: true, category: true },
 });

 if (!wine) {
 return NextResponse.json({ error: 'Wine not found' }, { status: 404 });
 }

 if (!includeInactive && !wine.isActive) {
 return NextResponse.json({ error: 'Wine not found' }, { status: 404 });
 }

 return NextResponse.json(wine);
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 const { id } = params;
 const existingWine = await prisma.wine.findUnique({ where: { id } });
 if (!existingWine) {
 return new Response('Wine not found', { status: 404 });
 }

 const body = await request.json();
 const { name, year, description, price, stock, region, bodega, maridaje, grapeTypeId, grapeTypeName, photos, categoryId, categorySlug, categoryName, isActive, replacePhotos } = body || {};

 const parsedYear = Number(year);
 const parsedPrice = Number(price ?? 0);
 const parsedStock = Number(stock ?? 0);

 if (!name || !year) {
 return new Response('Missing name or year', { status: 400 });
 }

 if (!Number.isInteger(parsedYear) || parsedYear < 1900) {
 return new Response('Invalid year', { status: 400 });
 }

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

 if (replacePhotos && Array.isArray(photos)) {
   await prisma.photo.deleteMany({ where: { wineId: id } });
 }

 const updatedWine = await prisma.wine.update({
   where: { id },
   data: {
     name,
     year: parsedYear,
     description: description || undefined,
     price: parsedPrice,
     stock: parsedStock,
     isActive: typeof isActive === 'boolean' ? isActive : true,
     region: region || 'Sin especificar',
     bodega: bodega || undefined,
     maridaje: maridaje || 'Versatile',
     categoryId: resolvedCategoryId,
     grapeTypeId: grapeId || null,
     photos: Array.isArray(photos)
       ? {
           create: photos.map((url: string) => ({ url })),
         }
       : undefined,
   },
   include: { grapeType: true, photos: true, category: true },
 });

 return NextResponse.json(updatedWine);
 } catch (error) {
 const message = error instanceof Error ? error.message : 'Server error';
 return new Response(message, { status: 500 });
 }
}