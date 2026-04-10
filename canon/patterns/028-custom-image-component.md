# Pattern 028: Custom Image Component

**Canon Version:** 1.0
**Status:** Stable
**Category:** Components
**Enforcement:** ESLint (`gallop/no-next-image`)

## Decision

Use the project's custom `Image` component from `@/components/image`. Do not use `next/image` directly.

## Rationale

1. **Studio integration** — Automatically resolves image metadata and dimensions via `getStudioImage()`, handling responsive sizing without manual width/height
2. **Consistent API** — Unified interface with project-specific props: size variants, captions, rounded corners, media links, lightbox support
3. **Standard defaults** — Enforces project defaults for lazy loading, rounded corners, and aspect ratios

## Examples

### Good

```tsx
import Image from '@/components/image'

<Image src="/images/hero.jpg" alt="Hero banner" size="large" />
```

```tsx
import Image from '@/components/image'

<Image
  src="/images/photo.jpg"
  alt="Gallery item"
  size="medium"
  caption="Figure 1"
  mediaLink
/>
```

### Bad

```tsx
import Image from 'next/image'

<Image src="/images/hero.jpg" alt="Hero banner" width={1200} height={600} />
```

```tsx
import Image from 'next/legacy/image'

<Image src="/images/hero.jpg" alt="Hero banner" layout="fill" />
```

## Enforcement

- **ESLint Rule:** `gallop/no-next-image`
- Flags `import` or `require()` of `next/image` or `next/legacy/image`

## References

- Custom Image component: `src/components/image.tsx`
- Studio helpers: `src/utils/studio-helpers.ts`
