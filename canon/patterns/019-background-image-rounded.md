# 019: Background Image Rounded

**Category:** Components  
**Status:** Stable  
**Enforcement:** ESLint (`gallop/background-image-rounded`)

## Summary

When using the `Image` component as a background image (with `absolute inset-0` positioning), always set `rounded="rounded-none"`.

## Rationale

The Image component defaults to `rounded-lg` for rounded corners. When used as a full-bleed background image, these rounded corners:

- **Cause visual artifacts** - corners get clipped unexpectedly
- **Conflict with container rounding** - the parent container should control edge styling
- **Create inconsistent edges** - background images should fill their container completely

## Bad

```tsx
{/* Background image without rounded prop - uses default rounded-lg */}
<Image
  src="/images/hero-bg.jpg"
  alt="Background"
  className="absolute inset-0 w-full h-full object-cover"
/>
```

## Good

```tsx
{/* Background image with explicit rounded-none */}
<Image
  src="/images/hero-bg.jpg"
  alt="Background"
  className="absolute inset-0 w-full h-full object-cover"
  rounded="rounded-none"
/>
```

## Detection

The rule identifies background images by checking for:
- `Image` component usage
- `className` containing both `absolute` and `inset-0`

When detected, the rule requires `rounded="rounded-none"` to be explicitly set.

## Exceptions

This rule only applies to files in `/blocks/`. Component files that implement background image patterns internally are not flagged.
