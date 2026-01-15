# Pattern 002: Layout Hierarchy

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Layout  
**Enforcement:** ESLint

## Decision

Do not use `Container` inside `Section`. The `Section` component already handles containment.

## Rationale

1. **Redundant nesting** — `Section` already provides max-width and padding
2. **Consistent spacing** — Avoids double-padding issues
3. **Simpler DOM** — Fewer wrapper elements
4. **Predictable layout** — One component handles section layout

The layout hierarchy should be:
```
Section → Columns → Column → Content
```

Not:
```
Section → Container → Columns → Column → Content
```

## Examples

### Bad

```tsx
<Section>
  <Container>
    <Heading>Title</Heading>
    <Paragraph>Content here</Paragraph>
  </Container>
</Section>
```

### Good

```tsx
<Section>
  <Heading>Title</Heading>
  <Paragraph>Content here</Paragraph>
</Section>
```

```tsx
<Section innerAlign="content">
  <Heading>Title</Heading>
  <Paragraph>Content here</Paragraph>
</Section>
```

If you need custom max-width, use a plain `div`:

```tsx
<Section>
  <div className="max-w-4xl">
    <Heading>Title</Heading>
    <Paragraph>Content here</Paragraph>
  </div>
</Section>
```

## Enforcement

- **ESLint rule:** `gallop/no-container-in-section`
- **Severity:** Warning

## Escape Hatch

If you need nested containment for a specific design:

1. Use a plain `div` with Tailwind classes instead of `Container`
2. Document why the nested structure is necessary

## References

- `src/components/section.tsx` — Section component with built-in containment
- `src/blocks/section-35.tsx` — Example using div for custom max-width
