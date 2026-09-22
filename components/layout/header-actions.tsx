import { HeaderActionsClient } from "@/components/layout/header-actions-client";

export function HeaderActions({
  className,
  user,
}: {
  className?: string;
  user: { name: string | null; email: string | null; image: string | null } | null;
}) {
  return <HeaderActionsClient className={className} user={user} />;
}
