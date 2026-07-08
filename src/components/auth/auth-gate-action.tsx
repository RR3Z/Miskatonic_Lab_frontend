"use client";

import { SignInButton, useUser } from "@clerk/nextjs";
import type { VariantProps } from "class-variance-authority";
import Link from "next/link";
import type * as React from "react";

import { Button, type buttonVariants } from "@/components/ui/button";

type AuthGateActionProps = VariantProps<typeof buttonVariants> & {
  children: React.ReactNode;
  className?: string;
  href: string;
};

export function AuthGateAction({
  children,
  className,
  href,
  size,
  variant,
}: AuthGateActionProps) {
  const { isSignedIn } = useUser();

  if (isSignedIn) {
    return (
      <Button asChild className={className} size={size} variant={variant}>
        <Link href={href}>{children}</Link>
      </Button>
    );
  }

  return (
    <SignInButton mode="modal">
      <Button className={className} size={size} type="button" variant={variant}>
        {children}
      </Button>
    </SignInButton>
  );
}
