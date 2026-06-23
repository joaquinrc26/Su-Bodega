import { NextResponse } from 'next/server';
import { ADMIN_PASSWORD, createAdminCookie } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body || {};

    if (!password) {
      return new Response('Contraseña requerida', { status: 400 });
    }

    // Opción 1: Validar contra contraseña env (fallback para compatibilidad)
    if (!email && password === ADMIN_PASSWORD) {
      const response = NextResponse.json({ ok: true, message: 'Ingreso exitoso' });
      response.headers.set('Set-Cookie', createAdminCookie());
      return response;
    }

    // Opción 2: Validar contra BD de AdminUser
    if (!email) {
      return new Response('Email requerido', { status: 400 });
    }

    const admin = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (!admin || admin.password !== password) {
      return new Response('Credenciales inválidas', { status: 401 });
    }

    const response = NextResponse.json({ 
      ok: true, 
      message: 'Ingreso exitoso',
      admin: { id: admin.id, email: admin.email, name: admin.name }
    });

    response.headers.set('Set-Cookie', createAdminCookie());

    return response;
  } catch (error) {
    console.error('Error en login:', error);
    return new Response('Error en autenticación', { status: 500 });
  }
}
