# Gallop Canon v1.0 Guarantees

These guarantees are promises made by Canon v1.0. They are versioned and immutable once released.

## SEO Stability

**Guarantee ID:** `SEO_STABLE`  
**Since:** v1.0

### Promise

Applications built following Canon v1.0 patterns will not experience SEO regressions from architectural decisions.

### What This Means

- **Server-rendered by default** — All blocks render on the server, content is visible to crawlers
- **No hydration mismatches** — Client/server boundaries are clearly defined
- **Structured metadata** — All pages have complete OG, Twitter, and Schema.org data
- **Canonical URLs** — Every page declares its canonical URL
- **Crawlable content** — No content hidden behind client-only rendering

### Patterns That Enforce This

- [001 Server-First Blocks](./patterns/001-server-first-blocks.md)
- [016 Client Extraction](./patterns/016-client-extraction.md)
- [017 SEO Metadata](./patterns/017-seo-metadata.md)

---

## Performance Baseline

**Guarantee ID:** `PERF_BASELINE`  
**Since:** v1.0

### Promise

Applications built following Canon v1.0 patterns will have predictable, minimal client-side JavaScript in blocks.

### What This Means

- **Minimal client bundle** — Blocks don't add to client JavaScript
- **No layout shift** — Typography and spacing are predictable
- **Efficient hydration** — Only interactive components hydrate
- **Tree-shakeable imports** — Unused code is eliminated

### Patterns That Enforce This

- [001 Server-First Blocks](./patterns/001-server-first-blocks.md)
- [007 Import Paths](./patterns/007-import-paths.md)
- [010 Spacing System](./patterns/010-spacing-system.md)
- [016 Client Extraction](./patterns/016-client-extraction.md)

---

## Maintainability

**Guarantee ID:** `MAINTAIN`  
**Since:** v1.0

### Promise

Applications built following Canon v1.0 patterns will be maintainable by any developer familiar with the Canon.

### What This Means

- **Consistent file structure** — Blocks, components, and pages follow naming conventions
- **Traceable component usage** — Components are imported from known locations
- **Auditable styling** — Tailwind classes and component props are searchable
- **Documented patterns** — Every decision is explained with rationale

### Patterns That Enforce This

- [005 Page Structure](./patterns/005-page-structure.md)
- [006 Block Naming](./patterns/006-block-naming.md)
- [007 Import Paths](./patterns/007-import-paths.md)
- [004 Component Props](./patterns/004-component-props.md)
- [013 New Component Pattern](./patterns/013-new-component-pattern.md)

---

## Design System Compliance

**Guarantee ID:** `DESIGN_SYSTEM`  
**Since:** v1.0

### Promise

Applications built following Canon v1.0 patterns will have consistent visual design through typography, spacing, and color systems.

### What This Means

- **Semantic typography** — Text uses Heading, Paragraph, Label components
- **Consistent spacing** — Margins and paddings follow the spacing scale
- **Semantic colors** — Colors use tokens, not raw values
- **Responsive patterns** — Mobile-first breakpoints are standard

### Patterns That Enforce This

- [003 Typography Components](./patterns/003-typography-components.md)
- [004 Component Props](./patterns/004-component-props.md)
- [009 Color Tokens](./patterns/009-color-tokens.md)
- [010 Spacing System](./patterns/010-spacing-system.md)
- [011 Responsive Mobile-First](./patterns/011-responsive-mobile-first.md)

---

## Versioning Policy

### Guarantee Lifecycle

1. **Proposed** — Under consideration, may change
2. **Stable** — Committed, won't change in this major version
3. **Deprecated** — Will be removed in next major version
4. **Removed** — No longer applies

### Breaking Changes

Guarantees are never removed or weakened within a major version. If a guarantee must change:

1. It is deprecated in a minor release
2. Migration guidance is provided
3. It is removed in the next major release

### Version Pinning

Organizations can pin to a specific Canon version:

```json
{
  "dependencies": {
    "@gallop/canon": "1.0.0"
  }
}
```

Upgrades should be deliberate and tested.
