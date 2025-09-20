import React from "react";

type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className = "", style, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={`rounded-lg ${className}`}
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        border: '1px solid var(--color-border)',
        padding: '0.5rem 0.75rem'
      }}
      {...props}
    />
  );
});
Input.displayName = 'Input';

export default Input;