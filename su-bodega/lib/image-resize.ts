function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

// Achica la foto en el navegador: Vercel limita cada petición a ~4,5 MB y las fotos de celular pesan más.
export async function resizeImageToDataUrl(file: File, maxSide: number, quality = 0.85): Promise<string> {
  if (typeof createImageBitmap !== 'function') return readAsDataUrl(file);

  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext('2d');
  if (!context) {
    bitmap.close();
    return readAsDataUrl(file);
  }

  // JPEG no admite transparencia; se rellena de blanco para que no quede negro.
  context.fillStyle = '#ffffff';
  context.fillRect(0, 0, width, height);
  context.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  return canvas.toDataURL('image/jpeg', quality);
}
