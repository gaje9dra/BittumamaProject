import "server-only";

import { MEDIA_MAX_FILE_SIZE, isAllowedMediaMimeType, hasAllowedExtension, sniffImage, normalizeFilename, type MediaMimeType } from "@/lib/media/types";

export async function validateImageFile(file: File) {
  if (!file || file.size === 0) throw new Error("Choose an image file.");
  if (file.size > MEDIA_MAX_FILE_SIZE) throw new Error("Image is too large. Maximum size is 10 MB.");
  if (!isAllowedMediaMimeType(file.type)) throw new Error("Unsupported image type. Use JPEG, PNG, or WebP.");
  if (!hasAllowedExtension(file.name, file.type as MediaMimeType)) throw new Error("File extension does not match the supported image type.");
  const buffer = Buffer.from(await file.arrayBuffer());
  const detected = sniffImage(buffer);
  if (!detected || detected.mimeType !== file.type) throw new Error("The uploaded file does not match its declared image type.");
  return { buffer, detected, normalizedFilename: normalizeFilename(file.name), mimeType: detected.mimeType };
}
