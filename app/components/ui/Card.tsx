import React from "react";

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padding?: boolean;
  elevated?: boolean;
};

export const Card: React.FC<CardProps> = ({ padding = true, elevated = true, style, className = "", ...props }) => {
  return (
    <div
      className={`${elevated ? "shadow-sm" : ""} rounded-2xl ${padding ? "p-6" : ""} ${className}`}
      style={{ background: "var(--color-surface)", color: "var(--color-foreground)", ...style }}
      {...props}
    />
  );
};

export default Card;