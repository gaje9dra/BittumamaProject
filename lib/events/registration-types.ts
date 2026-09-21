export type RegistrationActionState = {
  ok: boolean;
  message: string | null;
  fieldErrors: Record<string, string>;
};
