"use client";

import { FormEvent, useMemo, useRef, useState } from "react";
import type { Service } from "@/data/services";
import { cn } from "@/lib/utils";

type FormValues = { name: string; email: string; phone: string; service: string; message: string; website: string; formStartedAt: string };
type FormErrors = Partial<Record<"name" | "email" | "phone" | "service" | "message", string>>;
const initialValues: FormValues = { name: "", email: "", phone: "", service: "", message: "", website: "", formStartedAt: "" };

function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};
  if (!values.name.trim()) errors.name = "Enter your full name.";
  else if (values.name.trim().length > 120) errors.name = "Keep your name under 120 characters.";
  if (!values.email.trim()) errors.email = "Enter your email address.";
  else if (values.email.trim().length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) errors.email = "Enter a valid email address.";
  if (!values.service) errors.service = "Select what you need help with.";
  if (!values.message.trim()) errors.message = "Tell us about your requirement.";
  else if (values.message.trim().length < 20) errors.message = "Add a little more detail so the requirement is clear.";
  else if (values.message.trim().length > 5000) errors.message = "Keep the requirement under 5,000 characters.";
  if (values.phone.trim() && (values.phone.trim().length > 32 || !/^[+\d][\d\s().-]{6,24}$/.test(values.phone.trim()))) errors.phone = "Enter a valid phone number or leave this field blank.";
  return errors;
}

export function ContactForm({ initialService = "", initialLocation, services }: { initialService?: string; initialLocation?: string; services: Service[] }) {
  const [values, setValues] = useState<FormValues>(() => ({ ...initialValues, service: initialService, formStartedAt: new Date().toISOString() }));
  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof FormValues, boolean>>>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "failure">("idle");
  const [serverMessage, setServerMessage] = useState("");
  const statusRef = useRef<HTMLDivElement>(null);
  const selectedService = useMemo(() => services.find((service) => service.slug === values.service), [services, values.service]);

  function update(field: keyof FormValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    if (touched[field]) setErrors(validate({ ...values, [field]: value }));
    setStatus("idle");
    setServerMessage("");
  }

  function handleBlur(field: keyof FormValues) {
    setTouched((current) => ({ ...current, [field]: true }));
    setErrors(validate(values));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values);
    setErrors(nextErrors);
    setTouched({ name: true, email: true, phone: Boolean(values.phone), service: true, message: true });
    if (Object.keys(nextErrors).length) {
      setStatus("failure");
      statusRef.current?.focus();
      return;
    }
    setStatus("submitting");
    setServerMessage("");
    try {
      const response = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = (await response.json()) as { success?: boolean; message?: string; errors?: FormErrors };
      if (!response.ok || !result.success) {
        setErrors(result.errors ?? {});
        setServerMessage(result.message ?? "We couldn't send your enquiry. Please try again.");
        setStatus("failure");
        statusRef.current?.focus();
        return;
      }
      setValues({ ...initialValues, formStartedAt: new Date().toISOString() });
      setErrors({});
      setTouched({});
      setServerMessage(result.message ?? "Your enquiry has been sent successfully.");
      setStatus("success");
      statusRef.current?.focus();
    } catch {
      setServerMessage("We couldn't send your enquiry. Please try again.");
      setStatus("failure");
      statusRef.current?.focus();
    }
  }

  const fieldClass = "mt-2 min-h-12 w-full rounded-[var(--radius-md)] border border-input bg-background px-4 type-body-sm text-foreground outline-none transition-[border-color,box-shadow,background-color] duration-[var(--motion-fast)] placeholder:text-muted-foreground/80 focus:border-primary focus:bg-surface focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:bg-surface-muted";
  const errorFor = (field: keyof FormErrors) => errors[field];

  return (
    <form noValidate onSubmit={handleSubmit} className="bg-transparent">
      <div className="grid gap-6">\n        {initialLocation ? <div className="border-l-2 border-primary bg-surface-muted px-4 py-3"><p className="type-label text-muted-foreground">Request context</p><p className="mt-1 type-body-sm">{initialLocation}</p></div> : null}
        <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
          <label htmlFor="contact-website">Website</label>
          <input id="contact-website" name="website" tabIndex={-1} autoComplete="off" value={values.website} onChange={(e) => update("website", e.target.value)} />
        </div>
        <div>
          <label htmlFor="contact-name" className="type-label">Full name <span aria-hidden="true">*</span></label>
          <input id="contact-name" name="name" autoComplete="name" value={values.name} onChange={(e) => update("name", e.target.value)} onBlur={() => handleBlur("name")} aria-invalid={Boolean(errorFor("name"))} aria-describedby={errorFor("name") ? "contact-name-error" : undefined} className={cn(fieldClass, errorFor("name") && "border-error")} disabled={status === "submitting"} />
          {errorFor("name") && <p id="contact-name-error" role="alert" className="type-caption mt-2 text-error">{errorFor("name")}</p>}
        </div>
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <label htmlFor="contact-email" className="type-label">Email <span aria-hidden="true">*</span></label>
            <input id="contact-email" name="email" type="email" autoComplete="email" value={values.email} onChange={(e) => update("email", e.target.value)} onBlur={() => handleBlur("email")} aria-invalid={Boolean(errorFor("email"))} aria-describedby={errorFor("email") ? "contact-email-error" : undefined} className={cn(fieldClass, errorFor("email") && "border-error")} disabled={status === "submitting"} />
            {errorFor("email") && <p id="contact-email-error" role="alert" className="type-caption mt-2 text-error">{errorFor("email")}</p>}
          </div>
          <div>
            <label htmlFor="contact-phone" className="type-label">Phone <span className="text-muted-foreground">(optional)</span></label>
            <input id="contact-phone" name="phone" type="tel" autoComplete="tel" value={values.phone} onChange={(e) => update("phone", e.target.value)} onBlur={() => handleBlur("phone")} aria-invalid={Boolean(errorFor("phone"))} aria-describedby={errorFor("phone") ? "contact-phone-error" : undefined} className={cn(fieldClass, errorFor("phone") && "border-error")} disabled={status === "submitting"} />
            {errorFor("phone") && <p id="contact-phone-error" role="alert" className="type-caption mt-2 text-error">{errorFor("phone")}</p>}
          </div>
        </div>
        <div>
          <label htmlFor="contact-service" className="type-label">What do you need help with? <span aria-hidden="true">*</span></label>
          <select id="contact-service" name="service" value={values.service} onChange={(e) => update("service", e.target.value)} onBlur={() => handleBlur("service")} aria-invalid={Boolean(errorFor("service"))} aria-describedby={errorFor("service") ? "contact-service-error" : undefined} className={fieldClass} disabled={status === "submitting"}>
            <option value="">Select a requirement</option>
            {services.map((service) => <option key={service.id} value={service.slug}>{service.title}{service.status === "Coming Soon" ? " — Coming Soon" : ""}</option>)}
            <option value="other">Other</option>
          </select>
          {selectedService?.status === "Coming Soon" && <p className="type-caption mt-2 text-muted-foreground">This service is marked Coming Soon in the current service catalogue. You can still describe the requirement so the enquiry has context.</p>}
          {errorFor("service") && <p id="contact-service-error" role="alert" className="type-caption mt-2 text-error">{errorFor("service")}</p>}
        </div>
        <div>
          <label htmlFor="contact-message" className="type-label">Tell us about your requirement <span aria-hidden="true">*</span></label>
          <textarea id="contact-message" name="message" rows={6} maxLength={5000} value={values.message} onChange={(e) => update("message", e.target.value)} onBlur={() => handleBlur("message")} aria-invalid={Boolean(errorFor("message"))} aria-describedby={errorFor("message") ? "contact-message-error" : "contact-message-help"} className={cn(fieldClass, "resize-y py-3", errorFor("message") && "border-error")} disabled={status === "submitting"} />
          {errorFor("message") ? <p id="contact-message-error" role="alert" className="type-caption mt-2 text-error">{errorFor("message")}</p> : <p id="contact-message-help" className="type-caption mt-2 text-muted-foreground">Include the project stage, support needed, and any relevant deadline or research/data requirement.</p>}
        </div>
        <div ref={statusRef} tabIndex={-1} aria-live="polite" className="min-h-5 outline-none">
          {serverMessage && <p role={status === "success" ? "status" : "alert"} className={cn("type-caption", status === "success" ? "text-primary" : "text-error")}>{serverMessage}</p>}
        </div>
        <button type="submit" disabled={status === "submitting"} className="group inline-flex min-h-12 w-full items-center justify-center rounded-[var(--radius-md)] bg-primary px-5 type-button text-primary-foreground transition-colors duration-[var(--motion-fast)] hover:bg-primary-700 focus-visible:outline-2 focus-visible:outline-offset-3 disabled:cursor-not-allowed disabled:bg-surface-muted disabled:text-muted-foreground">
          <span>{status === "submitting" ? "Sending…" : "Send Enquiry"}</span><span aria-hidden="true" className="transition-transform duration-[var(--motion-fast)] group-hover:translate-x-1">↗</span>
        </button>
      </div>
    </form>
  );
}
