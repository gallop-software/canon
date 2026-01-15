# Pattern 006: Block Naming

**Canon Version:** 1.0  
**Status:** Stable  
**Category:** Structure  
**Enforcement:** Documentation

## Decision

Block files use `{type}-{n}.tsx` naming with PascalCase function exports.

## Rationale

1. **Sequential organization** — Numbers indicate variants, not priority
2. **Easy discovery** — Group by type in file explorer
3. **No conflicts** — Numbers prevent naming collisions
4. **Consistent exports** — PascalCase matches React conventions

## Naming Rules

### File Names

- Lowercase with hyphens: `hero-1.tsx`, `section-15.tsx`
- Type prefix followed by number: `{type}-{n}.tsx`
- Check existing files to find next available number

### Function Exports

- PascalCase matching file name
- `hero-16.tsx` → `function Hero16()`
- `call-to-action-3.tsx` → `function CallToAction3()`

## Block Types

| Type | Description |
|------|-------------|
| `hero-{n}` | Hero/banner sections |
| `section-{n}` | General content sections |
| `content-{n}` | Content/feature sections |
| `showcase-{n}` | Portfolio/gallery showcases |
| `cover-{n}` | Full-width image/video covers |
| `contact-{n}` | Contact forms and info |
| `testimonial-{n}` | Testimonials |
| `blog-{n}` | Blog-related sections |
| `pricing-{n}` | Pricing tables |
| `process-{n}` | Process/steps sections |
| `about-{n}` | About sections |
| `services-{n}` | Services sections |
| `call-to-action-{n}` | CTA sections |
| `partners-{n}` | Partner/logo clouds |
| `accordion-{n}` | FAQ/accordion sections |
| `archive-{n}` | Archive/listing sections |
| `application-{n}` | Job application forms |
| `business-info-{n}` | Business information |
| `sidebar-{n}` | Sidebar panels |
| `portfolio-{n}` | Portfolio grids |

## Examples

### Good

```
src/blocks/
├── hero-1.tsx          → export default function Hero1()
├── hero-2.tsx          → export default function Hero2()
├── section-1.tsx       → export default function Section1()
├── call-to-action-1.tsx → export default function CallToAction1()
```

### Bad

```
src/blocks/
├── Hero.tsx            ❌ No number
├── hero_1.tsx          ❌ Underscore instead of hyphen
├── HeroSection.tsx     ❌ Wrong naming pattern
├── cta-1.tsx           ❌ Abbreviation not in type list
```

## Enforcement

- **Method:** Code review / Documentation
- **Future:** CI validation of naming patterns

## References

- `src/blocks/` — All block files follow this pattern
