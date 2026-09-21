import "server-only";

import { prisma } from "@/lib/db/prisma";
import { queueInternalInquiryNotification } from "@/lib/notifications/domain";

export type CreateContactInquiryInput = {
  name: string;
  email: string;
  phone?: string;
  serviceId?: string;
  userId?: string;
  message: string;
};

export async function createContactInquiry(input: CreateContactInquiryInput) {
  try {
    return await prisma.client.$transaction(async (tx) => {
      const inquiry = await tx.contactInquiry.create({
        data: {
          name: input.name,
          email: input.email,
          ...(input.phone ? { phone: input.phone } : {}),
          ...(input.serviceId ? { serviceId: input.serviceId } : {}),
          ...(input.userId ? { userId: input.userId } : {}),
          message: input.message,
          status: "NEW",
        },
        select: { id: true, name: true, email: true, message: true, serviceId: true },
      });
      const service = inquiry.serviceId
        ? await tx.service.findUnique({ where: { id: inquiry.serviceId }, select: { title: true } })
        : null;
      const notificationIds = await queueInternalInquiryNotification(tx, {
        id: inquiry.id,
        name: inquiry.name,
        email: inquiry.email,
        message: inquiry.message,
        serviceTitle: service?.title ?? null,
      });
      return { inquiryId: inquiry.id, notificationIds };
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("Contact inquiry persistence failed:", error);
    }
    throw new Error("Unable to save the contact inquiry.");
  }
}
