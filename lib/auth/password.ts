import { randomBytes, scrypt as nodeScrypt, timingSafeEqual } from "node:crypto";
function derive(password: string, salt: Buffer, keyLength: number) {
  return new Promise<Buffer>((resolve, reject) => {
    nodeScrypt(password, salt, keyLength, { N: COST, r: BLOCK_SIZE, p: PARALLELIZATION, maxmem: MAX_MEMORY }, (error, derived) => {
      if (error) reject(error);
      else resolve(derived);
    });
  });
}
const KEY_LENGTH = 64;
const COST = 16_384;
const BLOCK_SIZE = 8;
const PARALLELIZATION = 1;
const MAX_MEMORY = 32 * 1024 * 1024;
const FORMAT = "scrypt-v1";

function encode(value: Buffer) { return value.toString("base64url"); }
function decode(value: string) { return Buffer.from(value, "base64url"); }

export async function hashPassword(password: string) {
  const salt = randomBytes(16);
  const derived = await derive(password, salt, KEY_LENGTH);
  return [FORMAT, COST, BLOCK_SIZE, PARALLELIZATION, encode(salt), encode(derived)].join("$");
}

export async function verifyPassword(password: string, storedHash: string | null | undefined) {
  if (!storedHash) { await hashPassword(password); return false; }
  const parts = storedHash.split("$");
  if (parts.length !== 6 || parts[0] !== FORMAT) { await hashPassword(password); return false; }
  const [, costText, blockText, parallelText, saltText, expectedText] = parts;
  const cost = Number(costText), blockSize = Number(blockText), parallelization = Number(parallelText);
  if (![cost, blockSize, parallelization].every(Number.isSafeInteger) || cost < 1 || blockSize < 1 || parallelization < 1) { await hashPassword(password); return false; }
  try {
    const salt = decode(saltText);
    const expected = decode(expectedText);
    const derived = await new Promise<Buffer>((resolve, reject) => {
      nodeScrypt(password, salt, expected.length, { N: cost, r: blockSize, p: parallelization, maxmem: MAX_MEMORY }, (error, derived) => error ? reject(error) : resolve(derived));
    });
    return derived.length === expected.length && timingSafeEqual(derived, expected);
  } catch { return false; }
}

export function validatePassword(password: string, minimumLength = 10) {
  return typeof password === "string" && password.length >= minimumLength && password.length <= 200;
}
