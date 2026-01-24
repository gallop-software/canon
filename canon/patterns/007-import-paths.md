# Pattern 007: Import Paths

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Structure  
**Enforcement:** Documentation

## Decision

Use `@/` path aliases for all internal imports. Use direct file imports for components (no barrel exports).

## Rationale

1. **Consistent paths** — No relative path gymnastics (`../../..`)
2. **Refactoring safe** — Moving files doesn't break imports
3. **Clear origin** — `@/` indicates project source
4. **AI-readable** — Direct imports show exactly where each component lives
5. **Explicit dependencies** — No hidden re-exports through barrel files

## Path Aliases

| Alias | Resolves To | Example |
|-------|-------------|---------|
| `@/components` | `src/components` | `import { Heading } from '@/components/heading'` |
| `@/blocks` | `src/blocks` | `import Hero1 from '@/blocks/hero-1'` |
| `@/hooks` | `src/hooks` | `import { useInView } from '@/hooks/use-in-view'` |
| `@/template` | `src/template` | `import PageFooter from '@/template/page-footer'` |
| `@/utils` | `src/utils` | `import { cn } from '@/utils/cn'` |

## Import Patterns

### Components (Direct File Imports)

```tsx
// Good: Direct file imports
import { Heading } from '@/components/heading'
import { Paragraph } from '@/components/paragraph'
import { Button } from '@/components/button'
import { Section } from '@/components/section'
import { Columns, Column } from '@/components/columns'

// Bad: Barrel imports (don't use)
import { Heading, Paragraph, Button } from '@/components'
```

### Component Subfolders

For components in subfolders (like `navbar/`, `form/`):

```tsx
// Good: Import from subfolder
import { Navbar } from '@/components/navbar'
import { Form, FormInput } from '@/components/form'

// Within subfolders, same-folder imports can use relative paths
// In navbar/mobile-nav.tsx:
import { links } from './config'
import type { NavLink } from './types'
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
import { Heading } from '@/components/heading'
import { Paragraph } from '@/components/paragraph'
import { Button } from '@/components/button'
import { Section } from '@/components/section'
import { Columns, Column } from '@/components/columns'
import { Image } from '@/components/image'
import Hero1 from '@/blocks/hero-1'
import arrowDownIcon from '@iconify/icons-heroicons/arrow-down-20-solid'
```

### Bad

```tsx
// Barrel imports (no longer used)
import { Heading, Paragraph, Button } from '@/components'

// Relative imports outside component subfolders
import { Heading } from '../../components/heading'
import Hero1 from '../blocks/hero-1'

// Wrong alias format
import { Heading } from 'components/heading'
import { Heading } from '~/components/heading'
```

## Why Not Barrel Exports?

Barrel exports (`src/components/index.ts`) were previously used but removed because:

1. **AI tools** must trace through the barrel to find actual component files
2. **Hidden complexity** — Re-exports obscure where code actually lives
3. **Maintenance burden** — Must update barrel when adding/removing components
4. **No real benefit** — Direct imports are equally concise and more explicit

## Enforcement

- **Method:** Code review / ESLint import rules
- **Future:** Custom ESLint rule for path validation

## References

- `tsconfig.json` — Path alias configuration
