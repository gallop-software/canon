# @gallop.software/canon

**Gallop Canon** — A versioned, AI-compatible, auditable system of approved web architecture patterns.

## What is the Canon?

The Canon is a closed set of authoritative patterns that define how web applications should be built. Each pattern is:

- **Versioned** — Pin to a specific version, upgrade deliberately
- **Documented** — Decision-level documentation, not just code comments
- **Enforced** — ESLint rules, CI validation, or AI constraints
- **Immutable** — Once released, patterns don't change

## Installation

```bash
npm install @gallop.software/canon
```

## ESLint Setup

Add Canon rules to your `eslint.config.mjs`:

```javascript
import nextConfig from 'eslint-config-next'
import gallop from '@gallop.software/canon/eslint'

export default [
  ...nextConfig,
  {
    files: ['src/blocks/**/*.tsx', 'src/components/**/*.tsx'],
    plugins: {
      gallop,
    },
    rules: {
      ...gallop.recommended,
    },
  },
]
```

### Opting Out of Rules

To disable specific rules, override them after spreading `recommended`:

```javascript
rules: {
  ...gallop.recommended,
  // Disable specific rules
  'gallop/no-inline-styles': 'off',
  'gallop/no-arbitrary-colors': 'off',
}
```

To change a rule from warning to error:

```javascript
rules: {
  ...gallop.recommended,
  'gallop/no-cross-zone-imports': 'error',
}
```

### Available Rules

| Rule | Description |
|------|-------------|
| `gallop/no-client-blocks` | Blocks must be server components |
| `gallop/no-container-in-section` | No Container inside Section |
| `gallop/prefer-component-props` | Use props over className for styles |
| `gallop/prefer-typography-components` | Use Paragraph/Span, not raw tags |
| `gallop/prefer-layout-components` | Use Grid/Columns, not raw div |
| `gallop/background-image-rounded` | Background images need rounded prop |
| `gallop/no-inline-styles` | No style attribute, use Tailwind |
| `gallop/no-arbitrary-colors` | Use color tokens, not arbitrary values |
| `gallop/no-cross-zone-imports` | Enforce import boundaries |
| `gallop/no-data-imports` | No direct _data/ imports in runtime |

## CLI Commands

### Generate AI Rules

Generate `.cursorrules` or Copilot instructions from Canon:

```bash
npx gallop generate .cursorrules
npx gallop generate .github/copilot-instructions.md
```

### Validate Project Structure

Check folder structure compliance:

```bash
npx gallop validate
npx gallop validate --strict  # Exit code 1 on violations
```

### Audit Code

Check code compliance:

```bash
npx gallop audit
npx gallop audit src/blocks/ --strict
```

## Pattern Categories

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

## Guarantees

See [guarantees.md](./guarantees.md) for version-specific promises.

## License

MIT
