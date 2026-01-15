# Pattern 007: Import Paths

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Structure  
**Enforcement:** Documentation

## Decision

Use `@/` path aliases for all internal imports. Use destructured imports for components.

## Rationale

1. **Consistent paths** — No relative path gymnastics (`../../..`)
2. **Refactoring safe** — Moving files doesn't break imports
3. **Clear origin** — `@/` indicates project source
4. **Smaller bundles** — Destructured imports enable tree shaking

## Path Aliases

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/components` | `src/components` | `import { Heading } from '@/components'` |
| `@/blocks` | `src/blocks` | `import Hero1 from '@/blocks/hero-1'` |
| `@/hooks` | `src/hooks` | `import { useInView } from '@/hooks/use-in-view'` |
| `@/template` | `src/template` | `import PageFooter from '@/template/page-footer'` |
| `@/utils` | `src/utils` | `import { cn } from '@/utils/cn'` |

## Import Patterns

### Components (Destructured)

```tsx
// Good: Destructured import from barrel
import { Heading, Paragraph, Button, Section, Columns, Column } from '@/components'

// Bad: Individual file imports
import { Heading } from '@/components/heading'
import { Paragraph } from '@/components/paragraph'
```

### Blocks (Default Export)

```tsx
// Good: Default import with descriptive name
import Hero1 from '@/blocks/hero-1'
import Section3 from '@/blocks/section-3'

// Bad: Named import (blocks use default exports)
import { Hero1 } from '@/blocks/hero-1'
```

### Hooks (Named or Default)

```tsx
// Init components (return null, used for side effects)
import CircleAnimationInit from '@/hooks/use-circle-animation'
import SwiperSliderInit from '@/hooks/swiper-slider-init'

// Traditional hooks
import { useInView } from '@/hooks/use-in-view'
```

### Icons

```tsx
// Good: Import from Iconify packages
import arrowRightIcon from '@iconify/icons-heroicons/arrow-right-20-solid'
import playCircleIcon from '@iconify/icons-lucide/play-circle'

// Use with Icon component
<Icon icon={arrowRightIcon} className="w-5 h-5" />
```

## Examples

### Good

```tsx
import {
  Heading,
  Paragraph,
  Button,
  Section,
  Columns,
  Column,
  Image,
} from '@/components'
import Hero1 from '@/blocks/hero-1'
import arrowDownIcon from '@iconify/icons-heroicons/arrow-down-20-solid'
```

### Bad

```tsx
// Relative imports
import { Heading } from '../../components/heading'
import Hero1 from '../blocks/hero-1'

// Wrong alias format
import { Heading } from 'components/heading'
import { Heading } from '~/components/heading'
```

## Enforcement

- **Method:** Code review / ESLint import rules
- **Future:** Custom ESLint rule for path validation

## References

- `tsconfig.json` — Path alias configuration
- `src/components/index.ts` — Component barrel file
