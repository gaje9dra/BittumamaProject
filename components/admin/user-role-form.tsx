"use client";

import { useActionState, useState } from "react";
import { setUserRole, userRoleInitialState } from "@/lib/admin/user-actions";

export function UserRoleForm({
  targetUserId,
  currentRole,
  actorUserId,
}: {
  targetUserId: string;
  currentRole: "USER" | "ADMIN";
  actorUserId: string;
}) {
  const [state, action, pending] = useActionState(setUserRole, userRoleInitialState);
  const [requestedRole, setRequestedRole] = useState<"USER" | "ADMIN">(currentRole);

  const isSelf = targetUserId === actorUserId;
  const changing = requestedRole !== currentRole;
  const requiresConfirmation = changing;

  function submit(event: React.FormEvent<HTMLFormElement>) {
    if (!requiresConfirmation) {
      event.preventDefault();
      return;
    }

    const message =
      requestedRole === "ADMIN"
        ? "Make this user an administrator?"
        : "Remove this user's administrative access?";

    if (!window.confirm(message)) {
      event.preventDefault();
    }
  }

  return (
    <form action={action} onSubmit={submit} className="space-y-3">
      <input type="hidden" name="targetUserId" value={targetUserId} />
      <div>
        <label htmlFor="user-role" className="block text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Role
        </label>
        <select
          id="user-role"
          name="role"
          value={requestedRole}
          onChange={(event) => setRequestedRole(event.target.value as "USER" | "ADMIN")}
          disabled={pending || isSelf}
          className="mt-1 min-h-10 w-full border border-border bg-background px-3 py-2.5 text-sm"
        >
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={pending || !changing || isSelf}
        className="min-h-10 border border-border px-4 py-2.5 text-sm font-medium hover:bg-surface-interactive disabled:cursor-not-allowed disabled:opacity-60"
      >
        {pending ? "Saving…" : requestedRole === "ADMIN" ? "Make Admin" : "Make User"}
      </button>

      {isSelf && <p className="text-xs text-muted-foreground">Your own administrative role cannot be removed here.</p>}
      {state.message && <p className="text-xs text-muted-foreground" role="status">{state.message}</p>}
      {state.error && <p className="text-xs text-destructive" role="alert">{state.error}</p>}
    </form>
  );
}
