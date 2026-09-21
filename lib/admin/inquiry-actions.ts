"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";

export type InquiryActionState = { message: string | null; error: string | null };

const initialState: InquiryActionState = { message: null, error: null };
export { initialState as inquiryInitialState };

const validStatuses = new Set(["NEW", "READ", "IN_PROGRESS", "RESOLVED", "SPAM"]);

export async function updateInquiryStatus(
  _previous: InquiryActionState,
  formData: FormData,
): Promise<InquiryActionState> {
  await requireAdmin();

  const id = String(formData.get("id") ?? "").trim();
  const status = String(formData.get("status") ?? "").trim();

  if (!/^[A-Za-z0-9_-]{1,64}$/.test(id)) return { message: null, error: "Invalid inquiry." };
  if (!validStatuses.has(status)) return { message: null, error: "Select a valid inquiry status." };

  try {
    const existing = await prisma.client.contactInquiry.findUnique({
      where: { id },
      select: { id: true },
    });
    if (!existing) return { message: null, error: "Inquiry not found." };

    await prisma.client.contactInquiry.update({
      where: { id },
      data: { status: status as Prisma.ContactInquiryStatus },
    });

    revalidatePath("/admin");
    revalidatePath("/admin/inquiries");
    revalidatePath(`/admin/inquiries/${id}`);
    return { message: "Status updated.", error: null };
  } catch (error) {
    if (process.env.NODE_ENV !== "production") console.error("Inquiry status update failed:", error);
    return { message: null, error: "Unable to update the inquiry status." };
  }
}
