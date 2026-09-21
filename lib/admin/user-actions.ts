"use server";

import { revalidatePath } from "next/cache";
import { AuditResult, AuditSeverity, Prisma, UserRole } from "@/generated/prisma/client";
import { requireAdmin } from "@/lib/auth/guards";
import { prisma } from "@/lib/db/prisma";
import { AUDIT, recordAudit, recordAuditBestEffort } from "@/lib/audit/service";

export type UserRoleActionState = {
  message: string | null;
  error: string | null;
};

const initialState: UserRoleActionState = { message: null, error: null };
export { initialState as userRoleInitialState };

const VALID_ROLES = new Set(["USER", "ADMIN"]);

function isValidUserId(id: string) {
  return /^[A-Za-z0-9_-]{1,64}$/.test(id);
}

export async function setUserRole(
  _previous: UserRoleActionState,
  formData: FormData,
): Promise<UserRoleActionState> {
  const actor = await requireAdmin();

  const targetUserId = String(formData.get("targetUserId") ?? "").trim();
  const requestedRole = String(formData.get("role") ?? "").trim();

  if (!isValidUserId(targetUserId)) {
    return { message: null, error: "Invalid user." };
  }

  if (!VALID_ROLES.has(requestedRole)) {
    return { message: null, error: "Select a valid role." };
  }

  const targetRole = requestedRole as UserRole;

  try {
    await prisma.client.$transaction(
      async (tx) => {
        const target = await tx.user.findUnique({
          where: { id: targetUserId },
          select: { id: true, role: true },
        });

        if (!target) {
          throw new UserRoleActionError("USER_NOT_FOUND");
        }

        if (target.id === actor.id && targetRole === UserRole.USER) {
          await recordAuditBestEffort(tx, { ...AUDIT.roleChanged(actor.id, target.id, target.role, targetRole), result: AuditResult.FAILURE, summary: "Self-demotion attempt rejected.", severity: AuditSeverity.WARNING });
          throw new UserRoleActionError("SELF_DEMOTION");
        }

        if (target.role === targetRole) {
          throw new UserRoleActionError("ALREADY_SET");
        }

        if (targetRole === UserRole.USER && target.role === UserRole.ADMIN) {
          const adminCount = await tx.user.count({
            where: { role: UserRole.ADMIN },
          });

          if (adminCount <= 1) {
            throw new UserRoleActionError("LAST_ADMIN");
          }
        }

        const previousRole = target.role;
        await tx.user.update({ where: { id: target.id }, data: { role: targetRole } });
        await recordAudit(tx, AUDIT.roleChanged(actor.id, target.id, previousRole, targetRole));
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );

    revalidatePath("/admin");
    revalidatePath("/admin/users");
    revalidatePath(`/admin/users/${targetUserId}`);

    return { message: "Role updated.", error: null };
  } catch (error) {
    if (error instanceof UserRoleActionError) {
      const messages: Record<string, string> = {
        USER_NOT_FOUND: "User not found.",
        SELF_DEMOTION: "You cannot remove your own administrative access.",
        ALREADY_SET: "That user already has this role.",
        LAST_ADMIN: "This user is the last remaining administrator. At least one administrator must remain.",
      };
      return { message: null, error: messages[error.code] ?? "Unable to update role." };
    }

    if (process.env.NODE_ENV !== "production") {
      console.error("User role update failed:", error);
    }

    return { message: null, error: "Unable to update role. Please try again." };
  }
}

class UserRoleActionError extends Error {
  constructor(public readonly code: string) {
    super(code);
    this.name = "UserRoleActionError";
  }
}
