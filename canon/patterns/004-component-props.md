# Pattern 004: Component Props Over className

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Typography  
**Enforcement:** ESLint

## Decision

Use dedicated props instead of `className` for styling that components support.

## Rationale

1. **Discoverable API** — Props are documented and autocompleted
2. **Consistent defaults** — Components define sensible defaults
3. **Easier auditing** — Can search for prop usage, not className patterns
4. **Type safety** — Props can be typed, className cannot

## Examples

### Bad

```tsx
<Heading className="text-center mb-6 text-accent">Title</Heading>
<Paragraph className="text-lg mb-4">Text content</Paragraph>
<Label className="text-sm font-semibold">Category</Label>
```

### Good

```tsx
<Heading textAlign="text-center" margin="mb-6" color="text-accent">
  Title
</Heading>
<Paragraph fontSize="text-lg" margin="mb-4">
  Text content
</Paragraph>
<Label fontSize="text-sm" fontWeight="font-semibold">
  Category
</Label>
```

## Supported Props by Component

### Heading
- `margin` — Bottom margin (e.g., `mb-8`, `mb-4`)
- `color` — Text color (e.g., `text-contrast`, `text-accent`)
- `textAlign` — Alignment (e.g., `text-center`, `text-left`)
- `fontSize` — Size (e.g., `text-4xl`, `text-2xl`)
- `fontWeight` — Weight (e.g., `font-bold`, `font-semibold`)

### Paragraph
- `margin` — Bottom margin
- `color` — Text color
- `textAlign` — Alignment
- `fontSize` — Size
- `lineHeight` — Line height

### Label
- `margin` — Bottom margin
- `color` — Text color
- `textAlign` — Alignment
- `fontSize` — Size
- `fontWeight` — Weight

### Accent
- `margin` — Bottom margin
- `color` — Text color
- `textAlign` — Alignment

### Button
- `margin` — Bottom margin

## When to Use className

Use `className` for styles that are NOT covered by props:

```tsx
{/* max-w is not a prop, so className is appropriate */}
<Paragraph className="max-w-lg">
  Content with constrained width
</Paragraph>
```

## Enforcement

- **ESLint rule:** `gallop/prefer-component-props`
- **Severity:** Warning
- **Detected patterns:** `mb-*`, `my-*`, `m-*`, `text-center`, `text-left`, `text-right`, `font-*`, `text-{color}` in className

## Escape Hatch

If a component doesn't support a prop you need:

1. Consider adding the prop to the component
2. Use className as a fallback with a comment explaining why

## References

- `src/components/heading.tsx` — Heading with prop overrides
- `src/components/paragraph.tsx` — Paragraph with prop overrides
- `src/components/label.tsx` — Label with prop overrides
