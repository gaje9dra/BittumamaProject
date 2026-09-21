import "server-only";

import { createReadStream } from "node:fs";
import { mkdir, rm, stat, writeFile } from "node:fs/promises";
import path from "node:path";

export type MediaStorageObject = { storageKey: string; mimeType: string; size: number };

export interface MediaStorage {
  put(input: { storageKey: string; data: Buffer; mimeType: string }): Promise<MediaStorageObject>;
  remove(storageKey: string): Promise<void>;
  exists(storageKey: string): Promise<boolean>;
  getStream(storageKey: string): Promise<ReturnType<typeof createReadStream>>;
}

const root = path.resolve(process.env.MEDIA_STORAGE_DIR?.trim() || path.join(process.cwd(), ".media-storage"));

function safePath(storageKey: string) {
  const resolved = path.resolve(/* turbopackIgnore: true */ root, storageKey);
  if (resolved !== root && !resolved.startsWith(root + path.sep)) throw new Error("Invalid storage key.");
  return resolved;
}

async function ensureRoot() { await mkdir(root, { recursive: true }); }

const localStorage: MediaStorage = {
  async put({ storageKey, data, mimeType }) {
    await ensureRoot();
    const filePath = safePath(storageKey);
    await mkdir(path.dirname(filePath), { recursive: true });
    await writeFile(filePath, data, { flag: "wx" });
    return { storageKey, mimeType, size: data.byteLength };
  },
  async remove(storageKey) { await rm(safePath(storageKey), { force: true }); },
  async exists(storageKey) { try { await stat(safePath(storageKey)); return true; } catch { return false; } },
  async getStream(storageKey) {
    if (!(await this.exists(storageKey))) throw new Error("Storage object not found.");
    return createReadStream(/* turbopackIgnore: true */ safePath(storageKey));
  },
};

export function getMediaStorage(): MediaStorage { return localStorage; }
export function getMediaStorageRoot() { return root; }
