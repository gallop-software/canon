# Pattern 003: Typography Components

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Typography  
**Enforcement:** ESLint

## Decision

Use `Paragraph` and `Span` components instead of raw `<p>` and `<span>` elements in blocks and components.

## Rationale

1. **Consistent styling** — Typography components apply default margins, colors, and fonts
2. **Prop-based customization** — Override styles via props, not className hunting
3. **Design system compliance** — All text follows the same patterns
4. **Easier refactoring** — Change defaults in one place

## Examples

### Bad

```tsx
<p className="text-sm text-gray-500 mb-4">Some descriptive text</p>
<span className="text-green-500 font-medium">+28%</span>
```

### Good

```tsx
<Paragraph fontSize="text-sm" color="text-gray-500">
  Some descriptive text
</Paragraph>
<Span color="text-green-500" fontWeight="font-medium">+28%</Span>
```

## Available Typography Components

| Component | Default Tag | Default Margin | Use Case |
|-----------|-------------|----------------|----------|
| `Heading` | `h2` | `mb-8` | All headings |
| `Paragraph` | `p` | `mb-8` | Body text blocks |
| `Span` | `span` | `mb-0` | Inline text |
| `Label` | `p` | `mb-0` | Labels, captions |
| `Quote` | `blockquote` | `mb-8` | Quotations |
| `Accent` | `span` | `mb-4` | Decorative accent text |

## Exceptions

Raw `<span>` is allowed when:

1. **Inside typography components** — For inline styling within Heading, Paragraph, etc.
2. **Gradient text effects** — When using `bg-clip-text` for gradient text

```tsx
{/* Allowed: span inside Heading for gradient effect */}
<Heading>
  Transform your space into something{' '}
  <span className="bg-gradient-to-r from-purple-600 to-pink-500 bg-clip-text text-transparent">
    extraordinary
  </span>
</Heading>
```

## Enforcement

- **ESLint rule:** `gallop/prefer-typography-components`
- **Severity:** Warning

## Escape Hatch

For gradient text or complex inline styling, raw `<span>` with `bg-clip-text` is allowed.

## References

- `src/components/paragraph.tsx` — Paragraph component
- `src/components/span.tsx` — Span component
- `src/components/heading.tsx` — Heading component
