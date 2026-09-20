import "server-only";

import { prisma } from "@/lib/db/prisma";

export type CreateContactInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  serviceId?: string;
  message: string;
};

export async function createContactInquiry(input: CreateContactInquiryInput) {
  try {
    await prisma.client.contactInquiry.create({
      data: {
        name: input.name,
        email: input.email,
        ...(input.phone ? { phone: input.phone } : {}),
        ...(input.serviceId ? { serviceId: input.serviceId } : {}),
        message: input.message,
        status: "NEW",
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Contact inquiry persistence failed:", error);
    }
    throw new Error("Unable to save the contact inquiry.");
  }
}
