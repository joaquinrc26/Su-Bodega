import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { isAdminRequest } from '@/lib/auth';

type RouteContext = { params: Promise<{ id: string }> };

async function resolveCategoryId(categoryId: string) {
  const category = await prisma.productCategory.findUnique({ where: { id: categoryId } });
  return category?.isActive ? category.id : null;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const includeInactive = new URL(request.url).searchParams.get('includeInactive') === '1';

  if (includeInactive && !isAdminRequest(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const wine = await prisma.wine.findUnique({
    where: { id },
    include: { grapeType: true, photos: true, category: true },
  });

  if (!wine || (!includeInactive && !wine.isActive)) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  return NextResponse.json(wine);
}

export async function PUT(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await context.params;
  const existingWine = await prisma.wine.findUnique({ where: { id } });
  if (!existingWine) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  const body = await request.json();
  const parsedYear = Number(body.year);
  const parsedPrice = Number(body.price);
  const parsedStock = Number(body.stock);

  if (!String(body.name || '').trim() || !Number.isInteger(parsedYear) || parsedYear < 1900) {
    return new Response('Datos del producto inválidos', { status: 400 });
  }
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return new Response('Precio inválido', { status: 400 });
  }
  if (!Number.isInteger(parsedStock) || parsedStock < 0) {
    return new Response('Stock inválido', { status: 400 });
  }
  if (typeof body.isActive !== 'boolean') {
    return new Response('Estado inválido', { status: 400 });
  }

  const categoryId = await resolveCategoryId(body.categoryId);
  if (!categoryId) {
    return new Response('Sección inválida', { status: 400 });
  }

  try {
    let grapeTypeId = body.grapeTypeId || null;
    if (!grapeTypeId && body.grapeTypeName?.trim()) {
      const grape = await prisma.grapeType.upsert({
        where: { name: body.grapeTypeName.trim() },
        update: {},
        create: { name: body.grapeTypeName.trim() },
      });
      grapeTypeId = grape.id;
    }

    if (body.replacePhotos && Array.isArray(body.photos)) {
      await prisma.photo.deleteMany({ where: { wineId: id } });
    }

    const wine = await prisma.wine.update({
      where: { id },
      data: {
        name: String(body.name).trim(),
        year: parsedYear,
        description: String(body.description || '').trim() || null,
        price: parsedPrice,
        stock: parsedStock,
        isActive: body.isActive,
        categoryId,
        region: String(body.region || 'Sin especificar').trim(),
        bodega: String(body.bodega || '').trim() || null,
        maridaje: String(body.maridaje || 'Versatile').trim(),
        grapeTypeId,
        photos: Array.isArray(body.photos)
          ? { create: body.photos.map((url: string) => ({ url })) }
          : undefined,
      },
      include: { grapeType: true, photos: true, category: true },
    });

    return NextResponse.json(wine);
  } catch {
    return new Response('No pudimos guardar los cambios', { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  if (!isAdminRequest(request)) {
    return new Response('Unauthorized', { status: 401 });
  }

  const { id } = await context.params;
  const wine = await prisma.wine.findUnique({ where: { id }, select: { id: true } });
  if (!wine) {
    return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 });
  }

  try {
    await prisma.$transaction([
      prisma.photo.deleteMany({ where: { wineId: id } }),
      prisma.wine.delete({ where: { id } }),
    ]);
    return NextResponse.json({ success: true });
  } catch {
    return new Response('No pudimos eliminar el producto', { status: 500 });
  }
}