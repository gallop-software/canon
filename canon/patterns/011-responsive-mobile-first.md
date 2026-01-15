# Pattern 011: Responsive Mobile-First

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Styling  
**Enforcement:** Documentation

## Decision

Design mobile-first. Use Tailwind breakpoint prefixes to progressively enhance for larger screens.

## Rationale

1. **Performance** — Mobile styles load first, enhancements are additive
2. **Accessibility** — Core experience works on all devices
3. **Maintainability** — Base styles are simple, complexity added at breakpoints
4. **SEO** — Google uses mobile-first indexing

## Breakpoint Scale

| Prefix | Min Width | Target |
|--------|-----------|--------|
| (none) | 0px | Mobile phones |
| `sm:` | 640px | Large phones, small tablets |
| `md:` | 768px | Tablets |
| `lg:` | 1024px | Laptops, small desktops |
| `xl:` | 1280px | Desktops |
| `2xl:` | 1536px | Large desktops |

## Common Patterns

### Layout Direction

```tsx
// Stack on mobile, row on desktop
<div className="flex flex-col lg:flex-row">
```

### Grid Columns

```tsx
// 1 column mobile, 2 columns tablet, 3 columns desktop
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### Responsive Typography

```tsx
// Smaller on mobile, larger on desktop
<Heading fontSize="text-3xl md:text-4xl lg:text-5xl">
  Responsive Heading
</Heading>
```

### Responsive Spacing

```tsx
// Less padding on mobile, more on desktop
<Section className="py-12 md:py-20 lg:py-30">
```

### Responsive Heights

```tsx
// Shorter on mobile, taller on desktop
<div className="h-[300px] sm:h-[450px] lg:h-[600px]">
```

### Show/Hide Elements

```tsx
// Hide on mobile, show on desktop
<nav className="hidden lg:flex">

// Show on mobile, hide on desktop
<button className="lg:hidden">Menu</button>
```

## Examples

### Good: Mobile-First

```tsx
<div className="
  flex flex-col gap-4
  md:flex-row md:gap-8
  lg:gap-16
">
  <div className="w-full md:w-1/2">Content</div>
  <div className="w-full md:w-1/2">Content</div>
</div>
```

### Bad: Desktop-First (Anti-Pattern)

```tsx
// Don't do this - starts with desktop, removes at mobile
<div className="
  flex flex-row gap-16
  max-md:flex-col max-md:gap-4
">
```

## Testing Checklist

- [ ] Works on 320px width (small phones)
- [ ] Works on 375px width (iPhone)
- [ ] Works on 768px width (tablet)
- [ ] Works on 1024px width (laptop)
- [ ] Works on 1440px width (desktop)

## Enforcement

- **Method:** Code review / Visual testing
- **Tools:** Browser DevTools responsive mode

## References

- Tailwind CSS responsive design docs
- All blocks are built mobile-first
