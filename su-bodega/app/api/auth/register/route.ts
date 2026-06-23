import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name } = body;

    // Validaciones
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, contraseña y nombre son requeridos' },
        { status: 400 }
      );
    }

    // Verificar si el email ya existe
    const existing = await prisma.adminUser.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 409 }
      );
    }

    // Crear nuevo admin
    const newAdmin = await prisma.adminUser.create({
      data: {
        email,
        password, // En producción usar bcrypt
        name,
      },
    });

    // Generar cookie
    const response = NextResponse.json(
      { 
        success: true, 
        message: 'Cuenta creada exitosamente',
        admin: { id: newAdmin.id, email: newAdmin.email, name: newAdmin.name }
      },
      { status: 201 }
    );

    response.cookies.set('su-bodega-admin', email, {
      httpOnly: true,
      maxAge: 60 * 60 * 24 * 7, // 7 días
      sameSite: 'strict',
    });

    return response;
  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error al crear la cuenta' },
      { status: 500 }
    );
  }
}
