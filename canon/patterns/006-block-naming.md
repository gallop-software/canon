# Pattern 006: Block Naming

**Canon Version:** 1.0
**Status:** Stable
**Category:** Structure
**Enforcement:** Documentation

## Decision

Block files are co-located in `_blocks/` subdirectories alongside page routes. Files use descriptive kebab-case names (`hero.tsx`, `booking.tsx`, `contact-form.tsx`). When a page has multiple blocks of the same kind, the first is `{name}.tsx` and subsequent are `{name}-2.tsx`, `{name}-3.tsx`, etc. Function exports use PascalCase.

## Rationale

1. **Co-location** — Blocks live next to the page that uses them, making ownership explicit
2. **Page-local naming** — No global numbering; names are scoped to the page
3. **Consistent exports** — PascalCase matches React conventions
4. **Private folders** — `_blocks/` uses Next.js private folder convention, excluded from routing

## Naming Rules

### File Names

- Lowercase with hyphens (kebab-case): `hero.tsx`, `booking.tsx`, `contact-form.tsx`
- Use descriptive names that reflect the block's content or purpose
- When a page has multiple blocks of the same kind, the first is `{name}.tsx`, subsequent are `{name}-2.tsx`, `{name}-3.tsx`, etc.
- Numbering based on JSX render order in the page

### Function Exports

- PascalCase matching file name
- `hero.tsx` → `function Hero()`
- `content-2.tsx` → `function Content2()`
- `call-to-action.tsx` → `function CallToAction()`

### Imports

- Use relative paths from page.tsx: `import Hero from './_blocks/hero'`

## Common Block Names

Any descriptive kebab-case name is valid. These are common examples:

| Name | Description |
|------|-------------|
| `hero` | Hero/banner sections |
| `call-to-action` | CTA sections |
| `services` | Services sections |
| `testimonial` | Testimonials |
| `cover` | Full-width image/video covers |
| `contact-form` | Contact forms |
| `contact-info` | Contact information |
| `overview` | Overview/intro sections |
| `booking` | Booking/reservation sections |
| `project` | Project showcase sections |
| `profile` | Profile/bio sections |
| `mission-values` | Mission and values sections |
| `design-philosophy` | Design philosophy sections |
| `accordion` | FAQ/accordion sections |
| `archive` | Archive/listing sections |
| `blog` | Blog-related sections |
| `pricing` | Pricing tables |
| `partners` | Partner/logo clouds |
| `portfolio` | Portfolio grids |
| `form` | Form sections |

## Examples

### Good

```
src/app/(default)/contact/
├── page.tsx
└── _blocks/
    ├── hero.tsx              → export default function Hero()
    ├── contact-form.tsx      → export default function ContactForm()
    ├── contact-info.tsx      → export default function ContactInfo()
    └── call-to-action.tsx    → export default function CallToAction()

src/app/(default)/portfolio/
├── page.tsx
└── _blocks/
    ├── hero.tsx              → export default function Hero()
    ├── project.tsx           → export default function Project()
    ├── project-2.tsx         → export default function Project2()
    ├── project-3.tsx         → export default function Project3()
    └── call-to-action.tsx    → export default function CallToAction()
```

### Bad

```
src/blocks/
├── Hero.tsx            ❌ Centralized, not co-located
├── hero_1.tsx          ❌ Underscore instead of hyphen
├── HeroSection.tsx     ❌ Wrong naming pattern

src/app/(default)/furniture/_blocks/
├── hero-1.tsx          ❌ Unnecessary number for singleton
├── CTA.tsx             ❌ Not kebab-case
```

## Enforcement

- **Method:** Code review / ESLint (`gallop/block-naming-convention`)
- ESLint rule validates export name matches filename

## References

- `src/app/**/_blocks/` — All block files follow this pattern
