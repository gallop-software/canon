# 025: No Components in Blocks

**Category:** Structure  
**Status:** Stable  
**Enforcement:** ESLint (`gallop/no-component-in-blocks`)

## Summary

Exported component functions must be in the components folder, not defined in block files. Non-exported content components are allowed.

## Rationale

Blocks should be self-contained page sections that import reusable components. When you define and export a component inside a block file, it:

1. **Breaks reusability** - The component can't be easily shared across other blocks
2. **Violates separation of concerns** - Blocks assemble components, components are building blocks
3. **Makes the codebase harder to navigate** - Components should live in `/components`

However, **content components** (non-exported helper functions that render specific content for that block) are allowed. These are internal to the block and not meant to be reused elsewhere.

## Bad

```tsx
// src/blocks/hero-1.tsx
export function FeatureCard({ title }: { title: string }) {
  // ❌ Exported component - should be in components folder
  return <div>{title}</div>
}

export default function Hero1() {
  return <FeatureCard title="Hello" />
}
```

## Good

```tsx
// src/blocks/hero-1.tsx
import { FeatureCard } from '@/components/feature-card'

export default function Hero1() {
  return <FeatureCard title="Hello" />
}
```

```tsx
// src/blocks/sidebar-1.tsx

// ✅ Non-exported content component - allowed
function Demo1() {
  return (
    <div className="space-y-6">
      <Heading as="h2">Panel 1 Content</Heading>
      <Paragraph>This content is specific to this block...</Paragraph>
    </div>
  )
}

// ✅ Non-exported content component - allowed
function Demo2() {
  return (
    <div className="space-y-6">
      <Heading as="h2">Panel 2 Content</Heading>
      <Paragraph>More specific content...</Paragraph>
    </div>
  )
}

const panels = {
  demo1: <Demo1 />,
  demo2: <Demo2 />,
}

export default function Sidebar1() {
  return (
    <SidebarStackProvider>
      <Section>...</Section>
      <SidebarPanels panels={panels} />
    </SidebarStackProvider>
  )
}
```

## Exceptions

- **Non-exported functions** - Internal content components that render block-specific content are allowed
- **The default export** - The block's main component is always allowed
- **Non-PascalCase functions** - Utility functions (camelCase) are not checked by this rule
