export type RegistrationActionState = {
  ok: boolean;
  message: string | null;
  fieldErrors: Record<string, string>;
};

export const registrationInitialState: RegistrationActionState = {
  ok: false,
  message: null,
  fieldErrors: {},
};
