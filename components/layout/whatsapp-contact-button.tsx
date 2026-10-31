import Link from "next/link";
import { contactData } from "@/data/contact";

const hasWhatsAppNumber = /^\d{10,15}$/.test(contactData.whatsappNumber);
const href = hasWhatsAppNumber
  ? `https://wa.me/${contactData.whatsappNumber}?text=${encodeURIComponent("Hello, I would like to know more about your services.")}`
  : "/contact";

export function WhatsAppContactButton() {
  return (
    <Link
      href={href}
      target={hasWhatsAppNumber ? "_blank" : undefined}
      rel={hasWhatsAppNumber ? "noopener noreferrer" : undefined}
      aria-label={hasWhatsAppNumber ? "Chat with us on WhatsApp" : "Contact us"}
      className="fixed bottom-5 right-5 z-[60] inline-flex min-h-14 items-center gap-3 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-[#073b20] shadow-[0_8px_28px_rgb(0_0_0_/_0.2)] transition-transform duration-200 hover:-translate-y-1 hover:bg-[#20c760] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#128c4a] sm:bottom-7 sm:right-7"
    >
      <svg aria-hidden="true" viewBox="0 0 32 32" className="h-6 w-6 fill-current">
        <path d="M16.02 3.2A12.63 12.63 0 0 0 5.1 22.16L3.3 28.8l6.8-1.78A12.7 12.7 0 1 0 16.02 3.2Zm0 22.98c-1.98 0-3.92-.53-5.62-1.54l-.4-.24-4.03 1.06 1.08-3.92-.26-.41a10.25 10.25 0 1 1 9.23 5.05Zm5.63-7.68c-.31-.16-1.84-.91-2.13-1.02-.29-.1-.5-.16-.71.16-.21.31-.81 1.02-.99 1.23-.18.21-.36.24-.67.08-.31-.16-1.31-.48-2.5-1.53-.92-.82-1.54-1.84-1.72-2.15-.18-.31-.02-.48.14-.64.14-.14.31-.36.47-.54.16-.18.21-.31.31-.52.1-.21.05-.39-.03-.55-.08-.16-.71-1.7-.97-2.33-.25-.61-.51-.52-.71-.53h-.6c-.21 0-.55.08-.84.39-.29.31-1.1 1.07-1.1 2.61s1.13 3.03 1.28 3.24c.16.21 2.22 3.39 5.38 4.75.75.32 1.34.52 1.8.66.76.24 1.45.2 1.99.12.61-.09 1.84-.75 2.1-1.49.26-.73.26-1.36.18-1.49-.08-.13-.29-.21-.6-.37Z" />
      </svg>
      <span>Chat with us</span>
    </Link>
  );
}
