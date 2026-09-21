import "server-only";

export const DEFAULT_CURRENCY = "INR";

export function assertAmountMinor(value: number) {
  if (!Number.isSafeInteger(value) || value <= 0) {
    throw new Error("Payment amount must be a positive integer minor-unit value.");
  }
  return value;
}

export function normalizeCurrency(value: string) {
  const currency = value.trim().toUpperCase();
  if (!/^[A-Z]{3}$/.test(currency)) throw new Error("Unsupported currency format.");
  return currency;
}

export function majorToMinor(value: string, currency = DEFAULT_CURRENCY) {
  normalizeCurrency(currency);
  const normalized = value.trim();
  if (!/^\d+(?:\.\d{1,2})?$/.test(normalized)) throw new Error("Invalid monetary amount.");
  const [whole, fraction = ""] = normalized.split(".");
  const minor = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
  return assertAmountMinor(minor);
}

export function minorToMajorString(amountMinor: number) {
  assertAmountMinor(amountMinor);
  return (amountMinor / 100).toFixed(2);
}