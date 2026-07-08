"use client";

import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { LogIn } from "lucide-react";
import type * as React from "react";

import { Button } from "@/components/ui/button";

type HeaderAuthProps = {
  children: React.ReactNode;
  className?: string;
};

export function HeaderAuth({ children, className }: HeaderAuthProps) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
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

  return (
    <SignInButton mode="modal">
      <Button className={className} size="sm" type="button" variant="ghost">
        <LogIn aria-hidden="true" className="size-[1.05rem]" />
        {children}
      </Button>
    </SignInButton>
  );
}
