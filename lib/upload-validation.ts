export const IMAGE_MIME_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"] as const;
export const IMAGE_ACCEPT = IMAGE_MIME_TYPES.join(",");
export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export function uploadError(file: {name: string; size: number; type: string}): string | null {
  if (!(IMAGE_MIME_TYPES as readonly string[]).includes(file.type)) return `${file.name}: usa JPG, PNG, WebP o AVIF. Convierte los archivos HEIC o PDF a imagen.`;
  if (file.size === 0) return `${file.name}: el archivo está vacío.`;
  if (file.size > MAX_UPLOAD_BYTES) return `${file.name}: supera el límite de 10 MB.`;
  return null;
}

export function uploadExtension(type: string): string {
  return ({"image/jpeg":"jpg","image/png":"png","image/webp":"webp","image/avif":"avif"})[type] ?? "jpg";
}
