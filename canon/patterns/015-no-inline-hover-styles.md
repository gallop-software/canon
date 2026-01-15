# Pattern 015: No Inline Hover Styles

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Styling  
**Enforcement:** Documentation

## Decision

Use Tailwind hover/focus classes. Do not use inline styles for interactive states.

## Rationale

1. **CSS handles it** — Pseudo-classes work in stylesheets, not inline
2. **No JavaScript** — Hover effects without React state
3. **Performance** — No re-renders on hover
4. **Consistency** — All hover states follow Tailwind patterns

## Examples

### Good: Tailwind Pseudo-Classes

```tsx
<button className="
  bg-accent text-white
  hover:bg-accent2
  focus:ring-2 focus:ring-accent
  active:bg-accent3
  transition-colors
">
  Click Me
</button>
```

### Bad: State-Based Styling

```tsx
function Button() {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <button
      style={{ backgroundColor: isHovered ? '#6b4a3a' : '#8b5a4a' }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      Click Me
    </button>
  )
}
```

## Common Hover Patterns

### Color Changes

```tsx
// Background color
<div className="bg-gray-100 hover:bg-gray-200">

// Text color
<a className="text-body hover:text-accent">

// Border color
<div className="border-gray-300 hover:border-accent">
```

### Transforms

```tsx
// Scale up on hover
<div className="hover:scale-105 transition-transform">

// Lift effect
<div className="hover:-translate-y-1 hover:shadow-lg transition-all">
```

### Opacity

```tsx
// Fade in overlay
<div className="opacity-0 hover:opacity-100 transition-opacity">

// Dim on hover
<button className="hover:opacity-80 transition-opacity">
```

### Group Hover

```tsx
// Parent hover affects child
<div className="group">
  <img className="group-hover:scale-110 transition-transform" />
  <span className="group-hover:text-accent">Title</span>
</div>
```

## Focus States

Always include focus states for accessibility:

```tsx
<button className="
  hover:bg-accent2
  focus:outline-none focus:ring-2 focus:ring-accent focus:ring-offset-2
">
```

## Transitions

Add transitions for smooth effects:

```tsx
// Single property
<div className="transition-colors duration-200">

// Multiple properties
<div className="transition-all duration-300">

// Specific properties
<div className="transition-[transform,opacity] duration-200">
```

## Enforcement

- **Method:** Code review / Documentation
- **Check:** No `onMouseEnter`/`onMouseLeave` for styling

## References

- Tailwind hover/focus docs
- `src/components/button.tsx` — Button with hover states
