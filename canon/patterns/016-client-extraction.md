# Pattern 016: Client Extraction

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Rendering  
**Enforcement:** ESLint (via 001)

## Decision

Extract client-side logic (hooks, event handlers) into dedicated client components. Blocks and most components should remain server components.

## Rationale

1. **Minimal client JavaScript** — Only interactive parts need client runtime
2. **Better performance** — Server components don't add to bundle
3. **Clear boundaries** — Easy to identify what runs where
4. **Easier testing** — Server components are pure renders

## Extraction Patterns

### Pattern A: Init Components (Side Effects Only)

For effects that don't render UI, create "init" components that return null:

```tsx
// src/hooks/use-circle-animation.tsx
'use client'
import { useEffect } from 'react'
import { useInView } from 'react-intersection-observer'

export default function CircleAnimationInit({ targetId }: { targetId: string }) {
  const { ref, inView } = useInView({ threshold: 0.1 })
  
  useEffect(() => {
    if (inView) {
      // Animation logic
    }
  }, [inView, targetId])
  
  return null // No UI, just side effects
}
```

Usage in server block:

```tsx
// src/blocks/hero-16.tsx (server component)
import CircleAnimationInit from '@/hooks/use-circle-animation'

export default function Hero16() {
  return (
    <Section>
      <div id="circle-text">...</div>
      <CircleAnimationInit targetId="circle-text" />
    </Section>
  )
}
```

### Pattern B: Interactive Components

For UI that needs interactivity, create client components:

```tsx
// src/components/video-popup.tsx
'use client'
import { useState } from 'react'
import { Dialog } from '@headlessui/react'

export function VideoPopup({ videoId }: { videoId: string }) {
  const [isOpen, setIsOpen] = useState(false)
  
  return (
    <>
      <button onClick={() => setIsOpen(true)}>Play</button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        {/* Video player */}
      </Dialog>
    </>
  )
}
```

### Pattern C: Event Delegation

For many clickable items, use event delegation:

```tsx
// src/components/sidebar-click-handler.tsx
'use client'

export function SidebarClickHandler({ children }: { children: React.ReactNode }) {
  const handleClick = (e: React.MouseEvent) => {
    const link = (e.target as HTMLElement).closest('a[data-sidebar]')
    if (link) {
      e.preventDefault()
      // Handle sidebar navigation
    }
  }
  
  return <div onClick={handleClick}>{children}</div>
}
```

## What Stays Server-Side

- Static content rendering
- Data fetching
- Metadata generation
- Layout structure

## What Moves to Client

- `useState`, `useEffect`, `useRef`
- Event handlers (`onClick`, `onChange`)
- Browser APIs (`window`, `document`)
- Animation libraries (Framer Motion)
- Third-party interactive widgets

## Static IDs

When server components need to reference DOM elements for client scripts:

```tsx
// Server component
const sliderId = 'hero-slider'
const circleId = 'hero-circle'

return (
  <>
    <div id={sliderId}>...</div>
    <div id={circleId}>...</div>
    <SwiperSliderInit swiperId={sliderId} />
    <CircleAnimationInit targetId={circleId} />
  </>
)
```

## Enforcement

- **ESLint rule:** `gallop/no-client-blocks` (Pattern 001)
- **Severity:** Warning

## References

- `src/hooks/use-circle-animation.tsx` — Init component pattern
- `src/hooks/swiper-slider-init.tsx` — Init component pattern
- `src/components/video-popup.tsx` — Interactive component pattern
- `src/components/sidebar-stack/` — Event delegation pattern
