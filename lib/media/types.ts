export const MEDIA_MAX_FILE_SIZE = 10 * 1024 * 1024;

export const MEDIA_ALLOWED_TYPES = {
  "image/jpeg": [".jpg", ".jpeg"],
  "image/png": [".png"],
  "image/webp": [".webp"],
} as const;

export type MediaMimeType = keyof typeof MEDIA_ALLOWED_TYPES;

export function isAllowedMediaMimeType(value: string): value is MediaMimeType {
  return value in MEDIA_ALLOWED_TYPES;
}

export function normalizeFilename(value: string) {
  const base = value.normalize("NFKC").replace(/[/\\\\?%*:|"<>]/g, "-");
  const ext = base.includes(".") ? base.slice(base.lastIndexOf(".")).toLowerCase() : "";
  const stem = (ext ? base.slice(0, -ext.length) : base)
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "")
    .slice(0, 120);
  return (stem || "upload") + ext;
}

export function hasAllowedExtension(filename: string, mimeType: MediaMimeType) {
  return MEDIA_ALLOWED_TYPES[mimeType].some((extension) => filename.toLowerCase().endsWith(extension));
}

export function sniffImage(buffer: Buffer): { mimeType: MediaMimeType; width: number; height: number } | null {
  if (buffer.length >= 24 && buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) {
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return width > 0 && height > 0 ? { mimeType: "image/png", width, height } : null;
  }
  if (buffer.length >= 12 && buffer.subarray(0, 4).toString("ascii") === "RIFF" && buffer.subarray(8, 12).toString("ascii") === "WEBP") {
    const kind = buffer.subarray(12, 16).toString("ascii");
    if (kind === "VP8 " && buffer.length >= 30) {
      const width = buffer.readUInt16LE(26) & 0x3fff;
      const height = buffer.readUInt16LE(28) & 0x3fff;
      return width > 0 && height > 0 ? { mimeType: "image/webp", width, height } : null;
    }
    if (kind === "VP8L" && buffer.length >= 25) {
      const width = 1 + (((buffer[22] & 0x3f) << 8) | buffer[21]);
      const height = 1 + (((buffer[24] & 0x0f) << 10) | (buffer[23] >> 6) | (buffer[22] << 2));
      return width > 0 && height > 0 ? { mimeType: "image/webp", width, height } : null;
    }
    if (kind === "VP8X" && buffer.length >= 30) {
      const width = 1 + (buffer[24] | (buffer[25] << 8) | (buffer[26] << 16));
      const height = 1 + (buffer[27] | (buffer[28] << 8) | (buffer[29] << 16));
      return width > 0 && height > 0 ? { mimeType: "image/webp", width, height } : null;
    }
  }
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 9 < buffer.length) {
      if (buffer[offset] !== 0xff) { offset += 1; continue; }
      const marker = buffer[offset + 1];
      offset += 2;
      if (marker === 0xd8 || marker === 0xd9 || (marker >= 0xd0 && marker <= 0xd7)) continue;
      if (offset + 2 > buffer.length) break;
      const length = buffer.readUInt16BE(offset);
      if (length < 2 || offset + length > buffer.length) break;
      const sof = (marker >= 0xc0 && marker <= 0xc3) || (marker >= 0xc5 && marker <= 0xc7) || (marker >= 0xc9 && marker <= 0xcb) || (marker >= 0xcd && marker <= 0xcf);
      if (sof && length >= 7) {
        const height = buffer.readUInt16BE(offset + 3);
        const width = buffer.readUInt16BE(offset + 5);
        return width > 0 && height > 0 ? { mimeType: "image/jpeg", width, height } : null;
      }
      offset += length;
    }
  }
  return null;
}
