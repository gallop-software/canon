# Pattern 009: Color Tokens

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Styling  
**Enforcement:** Documentation

## Decision

Use semantic color tokens instead of raw color values. Colors are defined as CSS custom properties.

## Rationale

1. **Theme consistency** — Colors change in one place
2. **Semantic meaning** — `text-contrast` is clearer than `text-gray-800`
3. **Dark mode ready** — Token values can change per theme
4. **Accessibility** — Contrast ratios are pre-validated

## Color Token System

### Text Colors

| Token | Usage |
|-------|-------|
| `text-body` | Default body text |
| `text-contrast` | High-contrast text (headings, emphasis) |
| `text-accent` | Accent/brand color text |
| `text-accent-contrast` | Text on accent backgrounds |
| `text-white` | White text |

### Background Colors

| Token | Usage |
|-------|-------|
| `bg-body` | Main page background |
| `bg-body2` | Secondary/alternate background |
| `bg-contrast` | High-contrast background |
| `bg-accent` | Primary accent background |
| `bg-accent2` | Secondary accent background |
| `bg-accent3` | Tertiary accent background |

### Pairing Rules

Accent backgrounds pair with contrast variants:

```tsx
// Good: Proper pairing
<div className="bg-accent text-accent-contrast">
  Readable text on accent background
</div>

// Bad: May have contrast issues
<div className="bg-accent text-body">
  Potentially unreadable
</div>
```

## Examples

### Good

```tsx
<Section className="bg-body2">
  <Heading color="text-contrast">Title</Heading>
  <Paragraph color="text-body">Body content</Paragraph>
  <Button className="bg-accent text-accent-contrast">
    Call to Action
  </Button>
</Section>
```

### Bad

```tsx
<Section className="bg-gray-100">
  <Heading className="text-gray-900">Title</Heading>
  <Paragraph className="text-gray-600">Body content</Paragraph>
  <Button className="bg-purple-600 text-white">
    Call to Action
  </Button>
</Section>
```

## CSS Variable Definitions

```css
:root {
  --color-body: #171412;
  --color-body2: #f2eae7;
  --color-contrast: #1a1a1a;
  --color-accent: #8b5a4a;
  --color-accent2: #6b4a3a;
  --color-accent3: #f2ebe1;
  --color-accent-contrast: #ffffff;
}
```

## When to Use Raw Colors

Raw Tailwind colors are acceptable for:

1. **Third-party content** — Colors from external data
2. **One-off decorative elements** — Gradients, shadows
3. **Status indicators** — `text-green-500` for success

## Enforcement

- **Method:** Code review / Documentation
- **Future:** ESLint rule to prefer tokens

## References

- `src/styles/tailwind.css` — Color token definitions
- `src/components/button.tsx` — Button using accent tokens
