import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { isAdminRequest } from '@/lib/auth';

export async function POST(request: Request) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 try {
 if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
	 return NextResponse.json(
		 { error: 'La subida de imágenes no está configurada. Completá CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY y CLOUDINARY_API_SECRET en .env.' },
		 { status: 503 }
	 );
 }

 const body = await request.json();
 const { file } = body;
 if (!file) return new Response('Missing file', { status: 400 });

 if (typeof file !== 'string' || !/^data:image\/(jpeg|png|webp);base64,/.test(file)) {
	 return new Response('Solo se aceptan imágenes JPG, PNG o WEBP.', { status: 400 });
 }

 const base64Content = file.split(',')[1] || '';
 const imageBytes = Math.ceil((base64Content.length * 3) / 4);
 if (imageBytes > 5 * 1024 * 1024) {
	 return new Response('La imagen supera el tamaño máximo de 5 MB.', { status: 400 });
 }

 const result = await cloudinary.uploader.upload(file, {
	 folder: 'su-bodega',
	 transformation: [{ width: 1200, height: 1200, crop: 'fill', gravity: 'auto', fetch_format: 'auto', quality: 'auto' }],
 });
 return NextResponse.json({ url: result.secure_url });
 } catch (err) {
 const errorMsg = err instanceof Error ? err.message : 'No pudimos subir la imagen.';
 return NextResponse.json({ error: errorMsg }, { status: 500 });
 }
}
