# Pattern 010: Spacing System

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Styling  
**Enforcement:** Documentation

## Decision

Use consistent spacing values from the Tailwind scale. Follow established defaults for sections, typography, and layout.

## Rationale

1. **Visual rhythm** — Consistent spacing creates harmony
2. **Predictable layouts** — Developers know what to expect
3. **Easier maintenance** — Change defaults in one place
4. **Design system compliance** — Spacing follows the scale

## Default Spacing Values

### Sections

| Element | Default | Description |
|---------|---------|-------------|
| Section padding (vertical) | `py-20 md:py-30` | Top and bottom padding |
| Section padding (horizontal) | `px-6 lg:px-8` | Left and right padding |
| Max width | `max-w-[1600px]` | Content container width |

### Typography

| Element | Default | Description |
|---------|---------|-------------|
| Heading margin | `mb-8` | All heading levels |
| Paragraph margin | `mb-8` | Body text blocks |
| Label margin | `mb-0` | Inline labels |
| Accent margin | `mb-4` | When above headings |
| Accent margin (decorative) | `mb-0` | When rotated/decorative |

### Layout

| Element | Default | Description |
|---------|---------|-------------|
| Column gap | `gap-8 lg:gap-16` | Between columns |
| Card padding | `p-6` | Internal card padding |
| Button spacing | `gap-4` | Between buttons |

## Examples

### Section Structure

```tsx
<Section className="py-20 md:py-30">
  <div className="mx-auto max-w-[1600px] px-6 lg:px-8">
    <Heading margin="mb-8">Section Title</Heading>
    <Paragraph margin="mb-8">Content paragraph.</Paragraph>
  </div>
</Section>
```

### Typography Stack

```tsx
<Accent margin="mb-4">Featured</Accent>
<Heading margin="mb-8">Main Heading</Heading>
<Paragraph margin="mb-8">First paragraph of content.</Paragraph>
<Paragraph margin="mb-0">Final paragraph, no margin.</Paragraph>
```

### Columns Layout

```tsx
<Columns
  cols="grid-cols-1 lg:grid-cols-2"
  gap="gap-8 lg:gap-16"
>
  <Column>Left content</Column>
  <Column>Right content</Column>
</Columns>
```

## Spacing Scale Reference

| Class | Value |
|-------|-------|
| `*-4` | 1rem (16px) |
| `*-6` | 1.5rem (24px) |
| `*-8` | 2rem (32px) |
| `*-10` | 2.5rem (40px) |
| `*-12` | 3rem (48px) |
| `*-16` | 4rem (64px) |
| `*-20` | 5rem (80px) |
| `*-30` | 7.5rem (120px) |

## Enforcement

- **Method:** Code review / Documentation
- **Component defaults:** Typography components have built-in margins

## References

- `src/components/section.tsx` — Section with default padding
- `src/components/heading.tsx` — Heading with mb-8 default
- `src/components/paragraph.tsx` — Paragraph with mb-8 default
