export type ContactInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  service: string;
  message: string;
  website?: string;
  formStartedAt?: string;
};

export type ContactInquiryValidationResult =
  | { success: true; data: { name: string; email: string; phone?: string; service: string; message: string; formStartedAt?: string } }
  | { success: false; errors: Partial<Record<keyof ContactInquiryInput, string>> };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PHONE_PATTERN = /^[+\d][\d\s().-]{6,24}$/;
const MAX_BODY_BYTES = 64 * 1024;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_PHONE_LENGTH = 32;
const MAX_SERVICE_LENGTH = 120;
const MIN_MESSAGE_LENGTH = 20;
const MAX_MESSAGE_LENGTH = 5000;

export function validateContactInquiryInput(
  input: unknown,
): ContactInquiryValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return { success: false, errors: { message: "Invalid request payload." } };
  }

  const value = input as Record<string, unknown>;
  const allowedKeys = new Set(["name", "email", "phone", "service", "message", "website", "formStartedAt"]);
  const unexpectedKey = Object.keys(value).find((key) => !allowedKeys.has(key));
  if (unexpectedKey) return { success: false, errors: { message: "Invalid request payload." } };
  const website = typeof value.website === "string" ? value.website.trim() : "";
  if (website) return { success: false, errors: { message: "Unable to process this submission." } };
  const name = typeof value.name === "string" ? value.name.trim() : "";
  const email = typeof value.email === "string" ? value.email.trim() : "";
  const phone = typeof value.phone === "string" ? value.phone.trim() : "";
  const service = typeof value.service === "string" ? value.service.trim() : "";
  const message = typeof value.message === "string" ? value.message.trim() : "";
  const website = typeof value.website === "string" ? value.website.trim() : "";
  const formStartedAt =
    typeof value.formStartedAt === "string" ? value.formStartedAt.trim() : undefined;

  const errors: Partial<Record<keyof ContactInquiryInput, string>> = {};

  if (!name) errors.name = "Enter your full name.";
  else if (name.length > MAX_NAME_LENGTH) errors.name = "Keep your name under 120 characters.";

  if (!email) errors.email = "Enter your email address.";
  else if (email.length > MAX_EMAIL_LENGTH || !EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address.";
  }

  if (phone && (phone.length > MAX_PHONE_LENGTH || !PHONE_PATTERN.test(phone))) {
    errors.phone = "Enter a valid phone number or leave this field blank.";
  }

  if (!service) errors.service = "Select what you need help with.";
  else if (service.length > MAX_SERVICE_LENGTH) errors.service = "Select a valid service.";

  if (!message) errors.message = "Tell us about your requirement.";
  else if (message.length < MIN_MESSAGE_LENGTH) {
    errors.message = "Add a little more detail so the requirement is clear.";
  } else if (message.length > MAX_MESSAGE_LENGTH) {
    errors.message = "Keep the requirement under 5,000 characters.";
  }

  if (Object.keys(errors).length) return { success: false, errors };

  return {
    success: true,
    data: {
      name,
      email: email.toLowerCase(),
      ...(phone ? { phone } : {}),
      service,
      message,
      ...(formStartedAt ? { formStartedAt } : {}),
    },
  };
}

export const contactInquiryLimits = {
  maxBodyBytes: MAX_BODY_BYTES,
  maxNameLength: MAX_NAME_LENGTH,
  maxEmailLength: MAX_EMAIL_LENGTH,
  maxPhoneLength: MAX_PHONE_LENGTH,
  maxServiceLength: MAX_SERVICE_LENGTH,
  minMessageLength: MIN_MESSAGE_LENGTH,
  maxMessageLength: MAX_MESSAGE_LENGTH,
};
