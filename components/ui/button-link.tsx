"use client";

import Link, { type LinkProps } from "next/link";
import type { AnchorHTMLAttributes, ReactNode } from "react";

import { cn } from "@/lib/utils";

type ButtonLinkProps = LinkProps & {
  children: ReactNode;
  className?: string;
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
  variant?: "primary" | "secondary" | "ghost";
};

const baseClasses =
  "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1A73E8]/40 focus-visible:ring-offset-2";

const variants: Record<NonNullable<ButtonLinkProps["variant"]>, string> = {
  primary:
    "bg-[#1A73E8] text-white shadow-[0_10px_24px_rgba(26,115,232,0.22)] hover:-translate-y-0.5 hover:bg-[#1765cc]",
  secondary:
    "border border-[#DADCE0] bg-white text-[#202124] shadow-sm hover:-translate-y-0.5 hover:border-[#1A73E8]/30 hover:shadow-md",
  ghost: "text-[#1A73E8] hover:bg-[#1A73E8]/[0.06]",
};

export function ButtonLink({
  children,
  className,
  variant = "primary",
  ...props
}: ButtonLinkProps) {
  return (
    <Link className={cn(baseClasses, variants[variant], className)} {...props}>
      {children}
    </Link>
  );
}
