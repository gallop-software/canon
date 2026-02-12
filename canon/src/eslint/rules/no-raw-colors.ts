import type { Rule } from 'eslint'
import { getCanonUrl, getCanonPattern } from '../utils/canon.js'

const RULE_NAME = 'no-raw-colors'
const pattern = getCanonPattern(RULE_NAME)

// Tailwind color prefixes (shared concept with no-arbitrary-colors)
const COLOR_PREFIXES = [
  'bg',
  'text',
  'border',
  'ring',
  'outline',
  'shadow',
  'accent',
  'caret',
  'fill',
  'stroke',
  'decoration',
  'divide',
  'from',
  'via',
  'to',
]

// Standard Tailwind named color families
const DEFAULT_FORBIDDEN_FAMILIES = [
  'white',
  'black',
  'gray',
  'slate',
  'zinc',
  'neutral',
  'stone',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

/**
 * Build regex to match raw Tailwind color classes.
 * Matches: text-white, bg-gray-500, border-slate-200, etc.
 */
function buildRawColorRegex(families: string[]): RegExp {
  const prefixes = COLOR_PREFIXES.join('|')
  const familyGroup = families.join('|')
  // Match {prefix}-{family} or {prefix}-{family}-{shade}
  return new RegExp(`\\b(?:${prefixes})-(?:${familyGroup})(?:-\\d{1,3})?\\b`)
}

/**
 * Extract all raw color class matches from a className string
 */
function findRawColorClasses(classValue: string, families: string[], allowedClasses: string[]): string[] {
  const prefixes = COLOR_PREFIXES.join('|')
  const familyGroup = families.join('|')
  const globalRegex = new RegExp(`\\b(?:${prefixes})-(?:${familyGroup})(?:-\\d{1,3})?\\b`, 'g')
  const matches: string[] = []
  let match: RegExpExecArray | null
  while ((match = globalRegex.exec(classValue)) !== null) {
    if (!allowedClasses.includes(match[0])) {
      matches.push(match[0])
    }
  }
  return matches
}

const rule: Rule.RuleModule = {
  meta: {
    type: 'suggestion',
    docs: {
      description: pattern?.summary || 'Use semantic color tokens, not raw Tailwind colors',
      recommended: true,
      url: getCanonUrl(RULE_NAME),
    },
    messages: {
      noRawColors: `[Canon ${pattern?.id || '009'}] Avoid raw Tailwind color "{{class}}". Use a semantic token instead.`,
    },
    schema: [
      {
        type: 'object',
        properties: {
          allowedClasses: {
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
    const allowedClasses: string[] = options.allowedClasses || []

    return {
      JSXAttribute(node: any) {
        // Only check className attributes
        if (node.name?.name !== 'className') {
          return
        }

        // Extract className value
        let classValue = ''

        if (node.value?.type === 'Literal' && typeof node.value.value === 'string') {
          classValue = node.value.value
        } else if (
          node.value?.type === 'JSXExpressionContainer' &&
          node.value.expression?.type === 'Literal' &&
          typeof node.value.expression.value === 'string'
        ) {
          classValue = node.value.expression.value
        } else if (
          node.value?.type === 'JSXExpressionContainer' &&
          node.value.expression?.type === 'TemplateLiteral'
        ) {
          classValue = node.value.expression.quasis
            .map((quasi: any) => quasi.value.raw)
            .join(' ')
        }

        if (!classValue) return

        const matches = findRawColorClasses(classValue, DEFAULT_FORBIDDEN_FAMILIES, allowedClasses)
        for (const cls of matches) {
          context.report({
            node,
            messageId: 'noRawColors',
            data: { class: cls },
          })
        }
      },
    }
  },
}

export default rule
