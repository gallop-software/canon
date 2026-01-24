import type { Rule } from 'eslint'
import * as fs from 'fs'
import * as path from 'path'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'require-canon-setup'
const pattern = getCanonPattern(RULE_NAME)

// Track if we've already reported for this lint run
let hasReported = false

// Required dev dependencies
const REQUIRED_DEPENDENCIES = ['knip', '@gallop.software/canon']

// Required npm scripts (key = script name, value = { contains: string to check for, definition: exact script to add })
const REQUIRED_SCRIPTS: Record<string, { contains: string; definition: string }> = {
  unused: {
    contains: 'knip',
    definition: '"unused": "knip"',
  },
  check: {
    contains: 'npm run',
    definition: '"check": "npm run lint && npm run ts && npm run unused"',
  },
  lint: {
    contains: 'eslint',
    definition: '"lint": "eslint src/"',
  },
  'lint:gallop': {
    contains: 'eslint src/blocks/',
    definition: `"lint:gallop": "eslint src/blocks/ --rule 'gallop/no-client-blocks: warn' --rule 'gallop/no-container-in-section: warn' --rule 'gallop/prefer-component-props: warn'"`,
  },
  ts: {
    contains: 'tsc',
    definition: '"ts": "tsc --noEmit"',
  },
  audit: {
    contains: 'gallop audit',
    definition: '"audit": "gallop audit"',
  },
  'audit:strict': {
    contains: 'gallop audit',
    definition: '"audit:strict": "gallop audit --strict"',
  },
  'audit:json': {
    contains: 'gallop audit',
    definition: '"audit:json": "gallop audit --json"',
  },
  'generate:ai-rules': {
    contains: 'gallop generate',
    definition: '"generate:ai-rules": "gallop generate .cursorrules && gallop generate .github/copilot-instructions.md"',
  },
  'update:canon': {
    contains: '@gallop.software/canon',
    definition: '"update:canon": "npm update @gallop.software/canon"',
  },
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Require Canon setup in package.json',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      missingDependency: `[Canon] Missing required dependency: "{{dep}}". Run: npm install -D {{dep}}`,
      missingScript: `[Canon] Missing required npm script "{{script}}". Add to package.json scripts: {{definition}}`,
      invalidScript: `[Canon] Script "{{script}}" should contain "{{expected}}". Expected: {{definition}}`,
    },
    schema: [],
  },

  create(context) {
    // Only check once per lint run, on the first file
    if (hasReported) {
      return {}
    }

    // Find the project root (where package.json is)
    const filename = context.filename || context.getFilename()
    let dir = path.dirname(filename)
    let packageJsonPath = ''
    
    // Walk up to find package.json
    while (dir !== path.dirname(dir)) {
      const candidate = path.join(dir, 'package.json')
      if (fs.existsSync(candidate)) {
        packageJsonPath = candidate
        break
      }
      dir = path.dirname(dir)
    }

    if (!packageJsonPath) {
      return {}
    }

    return {
      Program(node) {
        if (hasReported) return
        hasReported = true

        try {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
          const devDeps = packageJson.devDependencies || {}
          const deps = packageJson.dependencies || {}
          const allDeps = { ...deps, ...devDeps }
          const scripts = packageJson.scripts || {}

          // Check dependencies
          for (const dep of REQUIRED_DEPENDENCIES) {
            if (!allDeps[dep]) {
              context.report({
                node,
                messageId: 'missingDependency',
                data: { dep },
              })
            }
          }

          // Check scripts
          for (const [scriptName, { contains, definition }] of Object.entries(REQUIRED_SCRIPTS)) {
            if (!scripts[scriptName]) {
              context.report({
                node,
                messageId: 'missingScript',
                data: { script: scriptName, definition },
              })
            } else if (!scripts[scriptName].includes(contains)) {
              context.report({
                node,
                messageId: 'invalidScript',
                data: { script: scriptName, expected: contains, definition },
              })
            }
          }
        } catch {
          // Ignore parse errors
        }
      },
    }
  },
}

// Reset the flag when the module is reloaded (for watch mode)
export function resetReported() {
  hasReported = false
}

export default rule
