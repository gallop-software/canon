# Gallop

Architecture patterns, ESLint plugin, and CLI for Gallop template governance.

## Packages

| Package | Description |
|---------|-------------|
| [@gallop/canon](./canon) | Versioned architecture patterns and guarantees |
| [@gallop/eslint-plugin](./eslint-plugin) | ESLint rules enforcing Canon patterns |
| [@gallop/cli](./cli) | CLI for auditing and generating AI rules |

## Installation

```bash
npm install -D @gallop/eslint-plugin
```

## Usage

Add to your `eslint.config.mjs`:

```js
import gallopPlugin from '@gallop/eslint-plugin'

export default [
  gallopPlugin.configs.recommended,
  // ... your config
]
```

## Development

```bash
# Install dependencies
npm install

# Build all packages
npm run build

# Watch mode
npm run dev
```

## License

MIT
