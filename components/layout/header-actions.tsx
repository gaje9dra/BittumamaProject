import { getCurrentUser } from "@/lib/auth/guards";
import { HeaderActionsClient } from "@/components/layout/header-actions-client";

export async function HeaderActions({ className }: { className?: string }) {
  const user = await getCurrentUser();
  return (
    <HeaderActionsClient
      className={className}
      user={user ? { name: user.name ?? null, email: user.email ?? null, image: user.image ?? null } : null}
    />
  );
}
