import { NextResponse } from 'next/server';
import cloudinary from '@/lib/cloudinary';
import { isAdminRequest } from '@/lib/auth';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
const MAX_UPLOAD_BYTES = 5 * 1024 * 1024;

function parseDataUrl(file: string) {
 const match = file.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,(.+)$/);

 if (!match) {
 return null;
 }

 const [, mimeType, base64] = match;
 const byteSize = Buffer.byteLength(base64, 'base64');

 return { mimeType, byteSize };
}

export async function POST(request: Request) {
 if (!isAdminRequest(request)) {
 return new Response('Unauthorized', { status: 401 });
 }

 try {
 const body = await request.json();
 const { file } = body;
 if (!file) return new Response('Missing file', { status: 400 });

 const parsedFile = typeof file === 'string' ? parseDataUrl(file) : null;
 if (!parsedFile) {
 return new Response('Invalid image format', { status: 400 });
 }

 if (!ALLOWED_MIME_TYPES.has(parsedFile.mimeType)) {
 return new Response('Unsupported image format', { status: 415 });
 }

 if (parsedFile.byteSize > MAX_UPLOAD_BYTES) {
 return new Response('Image too large', { status: 413 });
 }

 const result = await cloudinary.uploader.upload(file, { folder: 'su-bodega' });
 return NextResponse.json({ url: result.secure_url });
 } catch (err) {
 const errorMsg = err instanceof Error ? err.message : 'Upload failed';
 return new Response(errorMsg, { status: 500 });
 }
}
