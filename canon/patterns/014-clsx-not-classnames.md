# Pattern 014: clsx Not classnames

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Styling  
**Enforcement:** Documentation

## Decision

Use `clsx` for conditional class names. Do not use the `classnames` package.

## Rationale

1. **Smaller bundle** — clsx is ~234B vs classnames ~454B
2. **Faster runtime** — clsx is optimized for performance
3. **Same API** — Drop-in replacement, familiar syntax
4. **Project standard** — Consistency across codebase

## Usage

### Import

```tsx
import { clsx } from 'clsx'
```

### Basic Conditionals

```tsx
<div className={clsx(
  'base-class',
  isActive && 'active-class',
  isDisabled && 'disabled-class'
)}>
```

### Object Syntax

```tsx
<div className={clsx({
  'base-class': true,
  'active-class': isActive,
  'disabled-class': isDisabled,
})}>
```

### Array Syntax

```tsx
<div className={clsx([
  'base-class',
  isActive ? 'active-class' : 'inactive-class',
])}>
```

### Combining Props and Conditions

```tsx
function Button({ className, isLoading }: Props) {
  return (
    <button
      className={clsx(
        'px-4 py-2 rounded font-medium',
        'bg-accent text-accent-contrast',
        'hover:bg-accent2 transition-colors',
        isLoading && 'opacity-50 cursor-not-allowed',
        className // Allow additional classes from parent
      )}
    >
      {isLoading ? 'Loading...' : children}
    </button>
  )
}
```

## Examples

### Good

```tsx
import { clsx } from 'clsx'

<div className={clsx(
  'flex items-center gap-2',
  variant === 'primary' && 'bg-accent text-white',
  variant === 'secondary' && 'bg-gray-100 text-gray-900',
  disabled && 'opacity-50 pointer-events-none'
)}>
```

### Bad

```tsx
// Using classnames package
import classNames from 'classnames'

<div className={classNames('flex', { 'bg-accent': isPrimary })}>

// Template literals (harder to read)
<div className={`flex ${isPrimary ? 'bg-accent' : ''}`}>

// Array join (non-standard)
<div className={['flex', isPrimary && 'bg-accent'].filter(Boolean).join(' ')}>
```

## Migration from classnames

```tsx
// Before
import classNames from 'classnames'
classNames('foo', { bar: true })

// After
import { clsx } from 'clsx'
clsx('foo', { bar: true })
```

The API is identical — just change the import.

## Enforcement

- **Method:** Code review / package.json audit
- **Check:** `classnames` should not appear in dependencies

## References

- clsx GitHub: https://github.com/lukeed/clsx
- All components use clsx for conditional classes
