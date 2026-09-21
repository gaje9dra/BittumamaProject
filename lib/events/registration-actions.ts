"use server";

import { revalidatePath } from "next/cache";
import { createRegistration, cancelOwnRegistration, type RegistrationActionState, registrationInitialState } from "@/lib/events/registration";

export async function submitEventRegistration(
  previous: RegistrationActionState = registrationInitialState,
  formData: FormData,
) {
  const result = await createRegistration(previous, formData);
  if (result.ok) {
    const eventSlug = String(formData.get("eventSlug") ?? "").trim();
    if (eventSlug) revalidatePath(`/workshops/${eventSlug}`);
  }
  return result;
}

export async function cancelEventRegistration(
  _previous: RegistrationActionState = registrationInitialState,
  formData: FormData,
) {
  const registrationId = String(formData.get("registrationId") ?? "").trim();
  const result = await cancelOwnRegistration(registrationId);
  if (result.ok) {
    const eventSlug = String(formData.get("eventSlug") ?? "").trim();
    if (eventSlug) revalidatePath(`/workshops/${eventSlug}`);
  }
  return result;
}
