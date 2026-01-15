# Pattern 013: New Component Pattern

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Components  
**Enforcement:** Documentation

## Decision

New components expose props for commonly overridden styles instead of relying solely on `className`.

## Rationale

1. **Discoverable API** — Props appear in autocomplete
2. **Consistent defaults** — Sensible defaults built-in
3. **Type safety** — Props can be typed and documented
4. **Easier refactoring** — Change defaults in one place
5. **Lint compatibility** — Works with `prefer-component-props` rule

## Component Template

```tsx
import { clsx } from 'clsx'

interface MyComponentProps {
  margin?: string       // e.g., "mb-8", "mb-4"
  color?: string        // e.g., "text-accent", "text-contrast"
  fontSize?: string     // e.g., "text-lg", "text-sm"
  textAlign?: string    // e.g., "text-center", "text-left"
  fontWeight?: string   // e.g., "font-bold", "font-medium"
  className?: string    // Additional styling
  children: React.ReactNode
}

export function MyComponent({
  margin = 'mb-4',           // Sensible default
  color = 'text-contrast',   // Sensible default
  fontSize = 'text-base',
  textAlign = '',
  fontWeight = '',
  className = '',
  children,
}: MyComponentProps) {
  return (
    <div
      className={clsx(
        margin,
        color,
        fontSize,
        textAlign,
        fontWeight,
        className
      )}
    >
      {children}
    </div>
  )
}
```

## Standard Props

| Prop | Type | Common Values |
|------|------|---------------|
| `margin` | string | `mb-0`, `mb-4`, `mb-8` |
| `color` | string | `text-body`, `text-contrast`, `text-accent` |
| `fontSize` | string | `text-sm`, `text-base`, `text-lg`, `text-xl` |
| `textAlign` | string | `text-left`, `text-center`, `text-right` |
| `fontWeight` | string | `font-normal`, `font-medium`, `font-bold` |
| `lineHeight` | string | `leading-tight`, `leading-relaxed` |
| `className` | string | Any additional Tailwind classes |

## File Structure

1. Create file in `src/components/` with lowercase hyphenated name
2. Export from `src/components/index.ts`
3. Use `clsx` for combining classes

```
src/components/
├── my-component.tsx    ← Component file
├── index.ts            ← Add export here
```

## Examples

### Good: Props for Common Overrides

```tsx
// Definition
export function Badge({
  margin = 'mb-0',
  color = 'text-white',
  bgColor = 'bg-accent',
  fontSize = 'text-xs',
  className = '',
  children,
}: BadgeProps) {
  return (
    <span className={clsx(margin, color, bgColor, fontSize, 'px-2 py-1 rounded', className)}>
      {children}
    </span>
  )
}

// Usage
<Badge color="text-black" bgColor="bg-yellow-400">New</Badge>
```

### Bad: className-Only Styling

```tsx
// Definition - no props for common overrides
export function Badge({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <span className={clsx('text-xs px-2 py-1 rounded', className)}>
      {children}
    </span>
  )
}

// Usage - must override via className
<Badge className="text-black bg-yellow-400 mb-4">New</Badge>
```

## Enforcement

- **Method:** Code review / Documentation
- **Lint:** `gallop/prefer-component-props` encourages prop usage

## References

- `src/components/paragraph.tsx` — Example with full prop support
- `src/components/heading.tsx` — Example with full prop support
- `src/components/label.tsx` — Example with full prop support
