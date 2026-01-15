# @gallop/canon

**Gallop Enterprise Architecture Canon** — A versioned, AI-compatible, auditable system of approved web architecture patterns.

## What is the Canon?

The Canon is a closed set of authoritative patterns that define how serious web applications should be built. Each pattern is:

- **Versioned** — Pin to a specific version, upgrade deliberately
- **Documented** — Decision-level documentation, not just code comments
- **Enforced** — ESLint rules, CI validation, or AI constraints
- **Immutable** — Once released, patterns don't change

## Installation

```bash
npm install @gallop/canon
```

## Usage

### Access Pattern Metadata

```typescript
import { patterns, getPattern, getPatternsByCategory } from '@gallop/canon'

// Get all patterns
console.log(patterns)

// Get a specific pattern
const pattern = getPattern('001')
console.log(pattern.title) // "Server-First Blocks"

// Get patterns by category
const renderingPatterns = getPatternsByCategory('rendering')
```

### Pattern Categories

| Category | Description |
|----------|-------------|
| `rendering` | Server/client component boundaries |
| `layout` | Layout hierarchy and spacing |
| `typography` | Text component usage |
| `structure` | File and folder organization |
| `styling` | CSS and Tailwind patterns |
| `components` | Component design patterns |
| `seo` | SEO and metadata patterns |

## Patterns

See the [patterns/](./patterns) directory for full documentation of each pattern.

### Enforced by ESLint

- **001** Server-First Blocks
- **002** Layout Hierarchy
- **003** Typography Components
- **004** Component Props

### Documentation-Only

- **005** Page Structure
- **006** Block Naming
- **007** Import Paths
- **008** Tailwind Only
- **009** Color Tokens
- **010** Spacing System
- **011** Responsive Mobile-First
- **012** Icon System
- **013** New Component Pattern
- **014** clsx Not classnames
- **015** No Inline Hover Styles
- **016** Client Extraction
- **017** SEO Metadata

## Guarantees

See [guarantees.md](./guarantees.md) for version-specific promises.

## License

MIT
