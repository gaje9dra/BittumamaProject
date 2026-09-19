"use client";

import { FormEvent, useMemo, useState } from "react";
import { services } from "@/data/services";
import { cn } from "@/lib/utils";

type FormValues = {
  name: string;
  email: string;
  phone: string;
  service: string;
  message: string;
};

type FormErrors = Partial<Record<keyof FormValues, string>>;

const initialValues: FormValues = {
  name: "",
  email: "",
  phone: "",
  service: "",
  message: "",
};

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Enter your full name.";
  if (!values.email.trim()) {
    errors.email = "Enter your email address.";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = "Enter a valid email address.";
  }
  if (!values.service) errors.service = "Select what you need help with.";
  if (!values.message.trim()) {
    errors.message = "Tell us about your requirement.";
  } else if (values.message.trim().length < 20) {
    errors.message = "Add a little more detail so the requirement is clear.";
  } else if (values.message.trim().length > 5000) {
    errors.message = "Keep the requirement under 5,000 characters.";
  }
  if (values.phone.trim() && !/^[+\d][\d\s().-]{6,24}$/.test(values.phone.trim())) {
    errors.phone = "Enter a valid phone number or leave this field blank.";
  }
  return errors;
}

export function ContactForm({ initialService = "" }: { initialService?: string }) {
  const [values, setValues] = useState<FormValues>(() => ({ ...initialValues, service: initialService }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "failure">("idle");

  const selectedService = useMemo(
    () => services.find((service) => service.slug === values.service),
    [values.service],
  );

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (touched[field]) {
      setErrors((current) => ({ ...current, ...validate({ ...values, [field]: value }) }));
    }
    setStatus("idle");
  }

  function handleBlur(field: keyof FormValues) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({
      name: true,
      email: true,
      phone: Boolean(values.phone),
      service: true,
      message: true,
    });
    if (Object.keys(nextErrors).length) {
      setStatus("failure");
      return;
    }
    setStatus("submitting");
    window.setTimeout(() => setStatus("failure"), 500);
  }

  const fieldClass =
    "mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-input-border bg-surface px-4 type-body-sm text-foreground outline-none transition-[border-color,box-shadow] duration-[var(--motion-fast)] placeholder:text-muted-foreground/80 focus:border-primary focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-surface-muted";

  const errorFor = (field: keyof FormValues) => errors[field];

  return (
    <form noValidate onSubmit={handleSubmit} className="border-y border-border bg-background">
      <div className="grid gap-7 p-5 sm:p-7">
        <div>
          <label htmlFor="contact-name" className="type-label">Full name <span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} onBlur={() => handleBlur("name")} aria-invalid={Boolean(errorFor("name"))} aria-describedby={errorFor("name") ? "contact-name-error" : undefined} className={cn(fieldClass, errorFor("name") && "border-error")} />
          {errorFor("name") && <p id="contact-name-error" role="alert" className="type-caption mt-2 text-error">{errorFor("name")}</p>}
        </div>

        <div className="grid gap-7 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className="type-label">Email <span aria-hidden="true">*</span></label>
            <input id="contact-email" name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} onBlur={() => handleBlur("email")} aria-invalid={Boolean(errorFor("email"))} aria-describedby={errorFor("email") ? "contact-email-error" : undefined} className={cn(fieldClass, errorFor("email") && "border-error")} />
            {errorFor("email") && <p id="contact-email-error" role="alert" className="type-caption mt-2 text-error">{errorFor("email")}</p>}
          </div>
          <div>
            <label htmlFor="contact-phone" className="type-label">Phone <span className="text-muted-foreground">(optional)</span></label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => handleBlur("phone")} aria-invalid={Boolean(errorFor("phone"))} aria-describedby={errorFor("phone") ? "contact-phone-error" : undefined} className={cn(fieldClass, errorFor("phone") && "border-error")} />
            {errorFor("phone") && <p id="contact-phone-error" role="alert" className="type-caption mt-2 text-error">{errorFor("phone")}</p>}
          </div>
        </div>

        <div>
          <label htmlFor="contact-service" className="type-label">What do you need help with? <span aria-hidden="true">*</span></label>
          <select id="contact-service" name="service" value={values.service} onChange={(e) => update("service", e.target.value)} onBlur={() => handleBlur("service")} aria-invalid={Boolean(errorFor("service"))} aria-describedby={errorFor("service") ? "contact-service-error" : undefined} className={fieldClass}>
            <option value="">Select a requirement</option>
            {services.map((service) => (
              <option key={service.id} value={service.slug}>
                {service.title}{service.status === "Coming Soon" ? " — Coming Soon" : ""}
              </option>
            ))}
            <option value="other">Other</option>
          </select>
          {selectedService?.status === "Coming Soon" && (
            <p className="type-caption mt-2 text-muted-foreground">
              This service is marked Coming Soon in the current service catalogue. You can still describe the requirement so the enquiry has context.
            </p>
          )}
          {errorFor("service") && <p id="contact-service-error" role="alert" className="type-caption mt-2 text-error">{errorFor("service")}</p>}
        </div>

        <div>
          <label htmlFor="contact-message" className="type-label">Tell us about your requirement <span aria-hidden="true">*</span></label>
          <textarea id="contact-message" name="message" rows={7} maxLength={5000} value={values.message} onChange={(e) => update("message", e.target.value)} onBlur={() => handleBlur("message")} aria-invalid={Boolean(errorFor("message"))} aria-describedby={errorFor("message") ? "contact-message-error" : "contact-message-help"} className={cn(fieldClass, "resize-y py-3", errorFor("message") && "border-error")} />
          {errorFor("message") ? <p id="contact-message-error" role="alert" className="type-caption mt-2 text-error">{errorFor("message")}</p> : <p id="contact-message-help" className="type-caption mt-2 text-muted-foreground">Include the project stage, support needed, and any relevant deadline or research/data requirement.</p>}
        </div>

        <div aria-live="polite" className="min-h-5">
          {status === "failure" && Object.keys(errors).length === 0 && (
            <p className="type-caption text-error">This enquiry form is ready for backend integration, but no submission service is connected yet.</p>
          )}
          {status === "submitting" && <p className="type-caption text-muted-foreground">Preparing enquiry…</p>}
        </div>

        <button type="submit" disabled={status === "submitting"} className="inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground">
          {status === "submitting" ? "Preparing…" : "Send Enquiry"}
        </button>
      </div>
    </form>
  );
}
