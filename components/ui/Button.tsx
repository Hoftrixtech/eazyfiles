import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    "bg-primary text-primary-foreground hover:bg-primary/88 active:bg-primary disabled:bg-primary/50",
  secondary:
    "border border-border bg-card/80 text-foreground hover:bg-muted active:bg-muted/80",
  ghost: "bg-transparent text-foreground hover:bg-muted",
  danger: "bg-destructive-soft text-destructive hover:opacity-90",
  inverse:
    "bg-surface-dark-foreground text-surface-dark hover:bg-white/90 border border-transparent",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "h-9 px-3.5 text-sm",
  md: "h-11 px-4 text-sm",
  lg: "h-12 px-6 text-sm font-medium tracking-tight",
};

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-[background-color,border-color,opacity,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    />
  );
}
