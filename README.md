# Gallop Canon

Architecture patterns, ESLint plugin, and CLI for Gallop template governance — all in one package.

## Installation

```bash
npm install -D @gallop.software/canon
```

## Usage

### ESLint Plugin

```javascript
// eslint.config.mjs
import gallop from '@gallop.software/canon/eslint'

export default [
  {
    files: ['src/blocks/**/*.tsx'],
    plugins: { gallop },
    rules: {
      'gallop/no-client-blocks': 'warn',
      'gallop/prefer-typography-components': 'warn',
    },
  },
]
```

### CLI

```bash
# Audit Canon compliance
gallop audit

# Generate AI rules
gallop generate .cursorrules
```

### Patterns API

```javascript
import { patterns, getPattern, version } from '@gallop.software/canon'

console.log(`Canon v${version}`)
console.log(patterns.length, 'patterns defined')
```

## Package Contents

- **Patterns** — 17 architecture patterns for Next.js templates
- **ESLint Plugin** — 4 rules enforcing Canon patterns
- **CLI** — Audit and generate tools
- **TypeScript** — Full type definitions

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Watch mode
npm run dev
```

## License

MIT
