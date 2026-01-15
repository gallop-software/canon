# Pattern 001: Server-First Blocks

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Rendering  
**Enforcement:** ESLint

## Decision

Blocks in `src/blocks/` must be server components. They must not use the `'use client'` directive.

## Rationale

Server components provide significant benefits for web applications:

1. **Smaller client bundle** — Server components don't add to JavaScript shipped to browsers
2. **SEO-safe by default** — Content is rendered on the server, visible to crawlers
3. **Predictable hydration** — No hydration mismatches when blocks are server-rendered
4. **Faster initial load** — Less JavaScript to parse and execute

Blocks are compositional units that should remain static and SEO-friendly. Interactive behavior belongs in components, not blocks.

## Examples

### Bad

```tsx
// src/blocks/hero-1.tsx
'use client'
import { useState } from 'react'

export default function Hero1() {
  const [isOpen, setIsOpen] = useState(false)
  // ...
}
```

### Good

```tsx
// src/blocks/hero-1.tsx (server component)
import { InteractiveFeature } from '@/components/interactive-feature'

export default function Hero1() {
  return (
    <Section>
      <Heading>Welcome</Heading>
      <InteractiveFeature /> {/* Client logic extracted */}
    </Section>
  )
}
```

```tsx
// src/components/interactive-feature.tsx
'use client'
import { useState } from 'react'

export function InteractiveFeature() {
  const [isOpen, setIsOpen] = useState(false)
  // Client-side logic lives here
}
```

## Enforcement

- **ESLint rule:** `gallop/no-client-blocks`
- **Severity:** Warning (upgradeable to error)

## Escape Hatch

If a block absolutely requires client-side logic that cannot be extracted:

1. Document why extraction is impossible
2. Consider if it should be a component instead of a block
3. Use `// eslint-disable-next-line gallop/no-client-blocks` with a comment explaining why

This should be extremely rare. Most "exceptions" indicate a design issue.

## References

- `src/blocks/hero-1.tsx` — Server block with extracted video player
- `src/blocks/hero-16.tsx` — Server block with extracted animation init
- `src/components/gallery-popup.tsx` — Client component extracted from block
