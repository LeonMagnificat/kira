# Theming Guide

This project uses centralized CSS variables and minimal JS to support dark/light mode and brand customization.

## Tokens
- File: `app/design/theme.css`
- Semantic variables:
  - Colors: `--color-background`, `--color-surface`, `--color-foreground`, `--color-border`, `--color-muted`, `--color-muted-foreground`
  - Brand: `--color-primary`, `--color-primary-foreground`, `--color-accent`, `--color-success`, `--color-warning`, `--color-danger`
  - Fonts: `--font-sans`
  - Radii: `--radius-sm|md|lg|xl`

Dark mode overrides are applied on `:root.dark`.

## Usage
Prefer tokens over hard-coded color classes. Keep Tailwind layout utilities.

Examples:
```tsx
// Background + text
<div style={{ background: 'var(--color-surface)', color: 'var(--color-foreground)' }} />

// Borders
<div style={{ border: '1px solid var(--color-border)' }} />

// Buttons
<button style={{ background: 'var(--color-primary)', color: 'var(--color-primary-foreground)' }} />
```

## Theme mode
- Initial mode set pre-hydration in `app/root.tsx`
- Toggle component: `app/components/ThemeToggle.tsx`
- Persistence key: `kira:theme`

## Swapping brand palettes
- Update `--color-primary` and related variables in `app/design/theme.css`
- Optional: create additional palettes and switch them dynamically by adding a class to `<html>` and scoping overrides.

## Import aliases
Use `~/*` for app root imports (configured in `tsconfig.json`).

## Migration steps
1. Replace color utility classes with token styles in components.
2. Keep Tailwind layout utilities (spacing, flex, grid, typography size).
3. Avoid introducing another component library; prefer native + Tailwind + tokens.

## Linting (recommended)
Add rules to flag hard-coded color utilities and prefer token usage.
- ESLint custom rule or regex-based lint comments as interim.
- Stylelint can help flag raw hex colors in CSS.