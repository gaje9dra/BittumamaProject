export type ApiError = {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export type ApiResponse<T> = {
  data: T;
  meta?: Record<string, unknown>;
};

export type ApiErrorResponse = {
  error: ApiError;
};

export type ApiActor = {
  id: string;
  name?: string | null;
  email?: string | null;
  role?: string | null;
};
