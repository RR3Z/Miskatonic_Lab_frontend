"use client";

import { UserButton } from "@clerk/nextjs";

export function UserMenu() {
  return (
    <UserButton
      appearance={{
        elements: {
          userButtonTrigger: {
            borderRadius: "999px",
            cursor: "pointer",
            outlineColor: "var(--ml-focus-ring)",
          },
          userButtonAvatarBox: {
            height: "2rem",
            width: "2rem",
            border: "1px solid var(--ml-border-aged)",
            boxShadow: "0 0 0 1px rgba(0, 0, 0, 0.18)",
          },
        },
      }}
    />
  );
}
