export function apiErrorStatus(code: string) {
  switch (code) {
    case "VALIDATION_ERROR":
      return 400;
    case "UNAUTHENTICATED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
    case "PAYMENT_NOT_FOUND":
      return 404;
    case "CONFLICT":
    case "ALREADY_REGISTERED":
    case "REGISTRATION_CLOSED":
    case "EVENT_FULL":
    case "PAYMENT_PENDING":
    case "PAYMENT_FAILED":
    case "PAYMENT_TARGET_NOT_CONFIGURED":
      return 409;
    case "RATE_LIMITED":
      return 429;
    case "PAYMENT_PROVIDER_NOT_CONFIGURED":
      return 503;
    default:
      return 500;
  }
}

export function domainErrorMessage(code: string) {
  switch (code) {
    case "UNAUTHENTICATED": return "Authentication is required.";
    case "FORBIDDEN": return "You are not authorized to perform this action.";
    case "NOT_FOUND":
    case "PAYMENT_NOT_FOUND": return "The requested resource was not found.";
    case "RATE_LIMITED": return "Too many requests. Please try again later.";
    case "PAYMENT_TARGET_NOT_CONFIGURED": return "This payment target is not configured.";
    case "PAYMENT_PROVIDER_NOT_CONFIGURED": return "Online payments are temporarily unavailable.";
    default: return "The request could not be completed.";
  }
}
