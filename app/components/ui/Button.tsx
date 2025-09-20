import React from "react";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost";
  size?: "sm" | "md" | "lg";
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", style, className = "", ...props }, ref) => {
    const paddings = size === "sm" ? "px-3 py-1.5" : size === "lg" ? "px-5 py-3" : "px-4 py-2";

    const baseStyle: React.CSSProperties = {
      borderRadius: "var(--radius-md)",
      border: variant === "ghost" ? "1px solid var(--color-border)" : "none",
      background:
        variant === "primary"
          ? "var(--color-primary)"
          : variant === "secondary"
          ? "var(--color-surface)"
          : "transparent",
      color:
        variant === "primary"
          ? "var(--color-primary-foreground)"
          : "var(--color-foreground)",
    };

    return (
      <button
        ref={ref}
        className={`inline-flex items-center justify-center font-medium transition-colors ${paddings} ${className}`}
        style={{ ...baseStyle, ...style }}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export default Button;