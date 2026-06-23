import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { isAdminRequest } from '@/lib/auth';

export async function POST(request: Request) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 try {
 const body = await request.json();
 const { file } = body;
 if (!file) return new Response('Missing file', { status: 400 });

 const result = await cloudinary.uploader.upload(file, { folder: 'su-bodega' });
 return NextResponse.json({ url: result.secure_url });
 } catch (err) {
 const errorMsg = err instanceof Error ? err.message : 'Upload failed';
 return new Response(errorMsg, { status: 500 });
 }
}
