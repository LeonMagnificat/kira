import React from "react";

type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(({ className = "", style, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={`rounded-lg ${className}`}
      style={{
        background: 'var(--color-surface)',
        color: 'var(--color-foreground)',
        border: '1px solid var(--color-border)',
        padding: '0.5rem 0.75rem'
      }}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = 'Select';

export default Select;