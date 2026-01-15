# Pattern 008: Tailwind Only

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Styling  
**Enforcement:** Documentation

## Decision

Use Tailwind CSS classes exclusively. Do not use inline styles or CSS-in-JS.

## Rationale

1. **Consistent styling** — All styles come from the same system
2. **Design tokens** — Tailwind enforces spacing/color scales
3. **Performance** — No runtime CSS generation
4. **Scannable code** — Styles are visible in the JSX
5. **Tooling support** — Tailwind IntelliSense, Prettier sorting

## Examples

### Good

```tsx
<div className="flex items-center gap-4 p-6 bg-white rounded-lg shadow-lg">
  <Heading className="text-2xl">Title</Heading>
</div>
```

### Bad

```tsx
// Inline styles
<div style={{ display: 'flex', padding: '24px', backgroundColor: 'white' }}>
  <Heading>Title</Heading>
</div>

// CSS-in-JS
const StyledDiv = styled.div`
  display: flex;
  padding: 24px;
`;
```

## Allowed Exceptions

### Dynamic Values

When a style value comes from data or calculations:

```tsx
// Allowed: Dynamic positioning
<div style={{ left: `${position}px` }}>

// Allowed: CSS custom properties for theming
<div style={{ '--progress': `${percent}%` } as React.CSSProperties}>
```

### CSS Custom Properties

```tsx
// Allowed: Using CSS variables
<div className="bg-[var(--color-accent)]">
```

### Complex Animations

```tsx
// Allowed: Framer Motion
<motion.div animate={{ opacity: 1 }}>
```

## Conditional Classes

Use `clsx` for conditional classes:

```tsx
import { clsx } from 'clsx'

<button
  className={clsx(
    'px-4 py-2 rounded',
    isActive && 'bg-accent text-white',
    !isActive && 'bg-gray-100 text-gray-700'
  )}
>
```

## Enforcement

- **Method:** Code review / Documentation
- **Future:** ESLint rule to detect inline styles

## References

- `src/styles/tailwind.css` — Tailwind configuration
- All blocks and components use Tailwind exclusively
