# Pattern 012: Icon System

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Components  
**Enforcement:** Documentation

## Decision

Use Iconify icon packages with the `Icon` component. Do not use inline SVGs or other icon libraries.

## Rationale

1. **Consistent sizing** — Icon component handles dimensions
2. **Tree shaking** — Only imported icons are bundled
3. **Large library** — Access to thousands of icons
4. **Type safety** — Icon imports are typed

## Icon Packages

| Package | Usage |
|---------|-------|
| `@iconify/icons-heroicons` | UI icons (arrows, actions) |
| `@iconify/icons-lucide` | General purpose icons |
| `@iconify/icons-mdi` | Material Design icons |
| `@iconify/icons-simple-icons` | Brand/logo icons |

## Usage Pattern

### Import Icons

```tsx
import arrowRightIcon from '@iconify/icons-heroicons/arrow-right-20-solid'
import playCircleIcon from '@iconify/icons-lucide/play-circle'
import twitterIcon from '@iconify/icons-simple-icons/twitter'
```

### Render with Icon Component

```tsx
import { Icon } from '@/components'

<Icon icon={arrowRightIcon} className="w-5 h-5" />
<Icon icon={playCircleIcon} className="w-6 h-6 text-accent" />
```

### With Buttons

```tsx
<Button
  href="/contact"
  icon={arrowRightIcon}
  iconPlacement="after"
>
  Get Started
</Button>
```

## Common Icons

| Icon | Import |
|------|--------|
| Arrow right | `@iconify/icons-heroicons/arrow-right-20-solid` |
| Arrow down | `@iconify/icons-heroicons/arrow-down-20-solid` |
| Play | `@iconify/icons-heroicons/play-solid` |
| Play circle | `@iconify/icons-lucide/play-circle` |
| Check | `@iconify/icons-heroicons/check-20-solid` |
| X/Close | `@iconify/icons-heroicons/x-mark-20-solid` |
| Menu | `@iconify/icons-heroicons/bars-3-20-solid` |
| Sparkles | `@iconify/icons-heroicons/sparkles-20-solid` |

## Examples

### Good

```tsx
import arrowRightIcon from '@iconify/icons-heroicons/arrow-right-20-solid'
import { Icon } from '@/components'

<button className="flex items-center gap-2">
  Next
  <Icon icon={arrowRightIcon} className="w-5 h-5" />
</button>
```

### Bad

```tsx
// Inline SVG
<button>
  Next
  <svg className="w-5 h-5" viewBox="0 0 20 20">
    <path d="M..." />
  </svg>
</button>

// Other icon library
import { ArrowRight } from 'react-icons/hi'
<ArrowRight />
```

## Sizing Guidelines

| Context | Size |
|---------|------|
| Inline with text | `w-4 h-4` or `w-5 h-5` |
| Button icons | `w-5 h-5` |
| Standalone icons | `w-6 h-6` |
| Large decorative | `w-8 h-8` or larger |

## Enforcement

- **Method:** Code review / Documentation
- **Future:** ESLint rule to detect inline SVGs

## References

- `src/components/icon.tsx` — Icon component
- `src/components/button.tsx` — Button with icon support
- Iconify icon explorer: https://icon-sets.iconify.design/
