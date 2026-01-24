# 018: Layout Components

**Category:** Layout  
**Status:** Stable  
**Enforcement:** ESLint (`gallop/prefer-layout-components`)

## Summary

Use the `Grid` or `Columns` component instead of raw `<div>` elements with grid classes.

## Rationale

Raw `<div>` elements with grid classes bypass the design system's layout abstractions. The `Grid` and `Columns` components provide:

- **Consistent defaults** for gaps, columns, and alignment
- **Semantic intent** - code is more readable when intent is clear
- **Centralized updates** - layout defaults can be updated in one place
- **Reduced errors** - no need to remember all required grid classes

## Bad

```tsx
<div className="grid grid-cols-3 gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
  <div>Left content</div>
  <div>Right content</div>
</div>
```

## Good

```tsx
import { Grid } from '@/components/grid'
import { Columns, Column } from '@/components/columns'

<Grid cols="grid-cols-3" gap="gap-6">
  <Card>...</Card>
  <Card>...</Card>
  <Card>...</Card>
</Grid>

<Columns>
  <Column>Left content</Column>
  <Column>Right content</Column>
</Columns>
```

## Component Reference

### Grid

For multi-item grid layouts (3+ columns, card grids, galleries):

```tsx
<Grid
  cols="grid-cols-1 lg:grid-cols-3"  // optional, defaults to 1 → 3
  gap="gap-6"                         // optional, has sensible default
>
  {children}
</Grid>
```

### Columns

For two-column layouts with optional reversal:

```tsx
<Columns
  cols="grid-cols-1 lg:grid-cols-2"  // optional
  gap="gap-8"                         // optional
  align="items-center"                // optional
  reverseColumns={true}               // swap order on lg+
>
  <Column>Left</Column>
  <Column>Right</Column>
</Columns>
```

## Exceptions

The rule only applies to files in `/blocks/`. Component files may use raw divs with grid when building the layout primitives themselves.
