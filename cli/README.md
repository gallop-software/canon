# @gallop/cli

Command-line interface for Gallop Canon compliance auditing.

## Installation

```bash
npm install @gallop/cli
```

## Usage

### Audit Command

Check your codebase for Canon compliance:

```bash
# Audit src/blocks/ (default)
npx gallop audit

# Audit a specific path
npx gallop audit src/

# Audit with strict mode (exit code 1 on violations)
npx gallop audit --strict

# Output as JSON
npx gallop audit --json

# Auto-fix violations where possible
npx gallop audit --fix
```

### Example Output

```
╔════════════════════════════════════════════════════════════╗
║           Gallop Canon v1.0.0 Compliance Report           ║
╚════════════════════════════════════════════════════════════╝

  ✗ 3 violations in 2 files
  Path: src/blocks/

  Violations by Pattern:
    001 Server-First Blocks: 1
    003 Typography Components: 2

  Details:

  src/blocks/podcast-hero-1.tsx
    1:1 [001] Block uses 'use client'. Extract to components.
    29:13 [003] Use Paragraph component instead of <p>

  src/blocks/pricing-2.tsx
    38:15 [003] Use Paragraph component instead of <p>

  ─────────────────────────────────────────────────────────
  Fix violations manually following the Canon patterns
```

### JSON Output

```bash
npx gallop audit --json
```

```json
{
  "version": "1.0.0",
  "timestamp": "2026-01-15T12:00:00.000Z",
  "path": "src/blocks/",
  "violations": [
    {
      "file": "/path/to/src/blocks/hero-1.tsx",
      "line": 1,
      "column": 1,
      "message": "Block uses 'use client'",
      "ruleId": "gallop/no-client-blocks",
      "canonPattern": "001",
      "patternTitle": "Server-First Blocks"
    }
  ],
  "summary": {
    "total": 1,
    "byPattern": {
      "001": 1
    }
  }
}
```

## CI Integration

```yaml
# .github/workflows/canon.yml
name: Canon Compliance

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - run: npx gallop audit --strict
```

## Commands

| Command | Description |
|---------|-------------|
| `gallop audit [path]` | Check Canon compliance |
| `gallop version` | Show version information |
| `gallop help` | Show help message |

## Options

| Option | Description |
|--------|-------------|
| `--strict` | Exit with code 1 if violations found |
| `--json` | Output results as JSON |
| `--fix` | Auto-fix violations where possible |

## License

MIT
