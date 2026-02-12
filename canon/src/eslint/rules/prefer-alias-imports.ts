import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'prefer-alias-imports'
const pattern = getCanonPattern(RULE_NAME)

const DEFAULT_ZONES = [
  'components',
  'blocks',
  'hooks',
  'utils',
  'tools',
  'template',
  'types',
  'styles',
]

/**
 * Count how many "../" segments a relative path starts with
 */
function countParentSegments(importPath: string): number {
  const matches = importPath.match(/^\.\.\//g) || importPath.match(/^(\.\.\/)+/)
  if (!matches) return 0
  // Count occurrences of ../ at the start
  let count = 0
  let remaining = importPath
  while (remaining.startsWith('../')) {
    count++
    remaining = remaining.slice(3)
  }
  return count
}

/**
 * Check if an import path targets a Canon zone
 */
function getTargetZone(importPath: string, zones: string[]): string | null {
  // Walk past all ../ segments and check if the next segment is a zone
  let remaining = importPath
  while (remaining.startsWith('../')) {
    remaining = remaining.slice(3)
  }
  const firstSegment = remaining.split('/')[0]
  if (zones.includes(firstSegment)) {
    return firstSegment
  }
  return null
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use @/ alias imports instead of deep relative paths',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      useAlias: `[Canon ${pattern?.id || '007'}] Use "{{alias}}{{zone}}/..." instead of "{{importPath}}".`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          alias: {
            type: 'string',
          },
          zones: {
            type: 'array',
            items: { type: 'string' },
          },
        },
        additionalProperties: false,
      },
    ],
  },

  create(context) {
    const options = context.options[0] || {}
    const alias = options.alias || '@/'
    const zones = options.zones || DEFAULT_ZONES

    return {
      ImportDeclaration(node: any) {
        const importPath = node.source?.value
        if (typeof importPath !== 'string') return

        // Only check relative imports
        if (!importPath.startsWith('.')) return

        // Same-directory imports are fine
        if (importPath.startsWith('./')) return

        // Check if 2+ parent segments
        const parentCount = countParentSegments(importPath)
        if (parentCount < 2) return

        // Check if targeting a Canon zone
        const zone = getTargetZone(importPath, zones)
        if (zone) {
          context.report({
            node,
            messageId: 'useAlias',
            data: { alias, zone, importPath },
          })
        }
      },
    }
  },
}

export default rule
